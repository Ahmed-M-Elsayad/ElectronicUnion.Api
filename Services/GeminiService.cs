using System.Text;
using System.Text.Json;
using ElectronicUnion.Api.Configuration;
using ElectronicUnion.Api.Contracts;
using ElectronicUnion.Api.Models;
using Microsoft.Extensions.Options;

namespace ElectronicUnion.Api.Services;

public sealed class GeminiService : IGeminiService
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    private readonly HttpClient _httpClient;
    private readonly GeminiOptions _options;
    private readonly ILogger<GeminiService> _logger;

    public GeminiService(
        HttpClient httpClient,
        IOptions<GeminiOptions> options,
        ILogger<GeminiService> logger)
    {
        _httpClient = httpClient;
        _options = options.Value;
        _logger = logger;
        _httpClient.Timeout = TimeSpan.FromSeconds(_options.TimeoutSeconds);
    }

    public async Task<string> GetResponseAsync(
        string userMessage,
        CancellationToken cancellationToken = default)
    {
        var url = $"https://generativelanguage.googleapis.com/v1beta/models/{_options.Model}:generateContent?key={_options.ApiKey}";

        var payload = new
        {
            contents = new[]
            {
                new { parts = new[] { new { text = userMessage } } }
            }
        };

        var json = JsonSerializer.Serialize(payload, JsonOptions);
        using var content = new StringContent(json, Encoding.UTF8, "application/json");

        using var response = await _httpClient.PostAsync(url, content, cancellationToken);
        var body = await response.Content.ReadAsStringAsync(cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            _logger.LogError(
                "Gemini API failed. Status={StatusCode}, Body={Body}",
                response.StatusCode, body);
            throw new HttpRequestException($"Gemini returned {response.StatusCode}.");
        }

        var parsed = JsonSerializer.Deserialize<GeminiResponse>(body, JsonOptions);
        var reply = parsed?.Candidates?.FirstOrDefault()?.Content?.Parts?.FirstOrDefault()?.Text;

        return string.IsNullOrWhiteSpace(reply) ? "No response from AI." : reply;
    }
}