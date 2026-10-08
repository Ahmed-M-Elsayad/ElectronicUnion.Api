using System.ComponentModel.DataAnnotations;

namespace ElectronicUnion.Api.Configuration;

public sealed class GeminiOptions
{
    public const string SectionName = "GeminiSettings";

    [Required(ErrorMessage = "Gemini API key is required.")]
    public string ApiKey { get; set; } = string.Empty;

    public string Model { get; set; } = "gemini-pro";

    [Range(5, 120)]
    public int TimeoutSeconds { get; set; } = 30;
}