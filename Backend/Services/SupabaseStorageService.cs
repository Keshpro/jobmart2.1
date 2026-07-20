using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Supabase;
using System;
using System.IO;
using System.Threading.Tasks;

public interface ISupabaseStorageService
{
    Task<string> UploadFileAsync(IFormFile file, string bucketName);
}

public class SupabaseStorageService : ISupabaseStorageService
{
    private readonly Supabase.Client _supabaseClient;

    public SupabaseStorageService(Supabase.Client supabaseClient)
    {
        _supabaseClient = supabaseClient;
    }

#pragma warning disable CS8613 // Nullability of reference types in return type doesn't match implicitly implemented member.
    public async Task<string?> UploadFileAsync(IFormFile file, string bucketName)
#pragma warning restore CS8613 // Nullability of reference types in return type doesn't match implicitly implemented member.
    {
        try
        {
            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            var fileBytes = memoryStream.ToArray();

            var fileName = $"{Guid.NewGuid()}_{file.FileName}";
            
            // Upload file to Supabase storage bucket
            var response = await _supabaseClient.Storage
                .From(bucketName)
                .Upload(fileBytes, fileName);

            if (string.IsNullOrEmpty(response))
            {
                return null;
            }

            // Get public URL for the uploaded file
            var publicUrl = _supabaseClient.Storage
                .From(bucketName)
                .GetPublicUrl(fileName);

            return publicUrl;
        }
        catch (Exception)
        {
            return null;
        }
    }
}