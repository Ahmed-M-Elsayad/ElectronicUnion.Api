namespace ElectronicUnion.Api.Contracts;

/// <summary>
/// Abstraction for the AI chat provider. Enables DIP and easy testing.
/// </summary>
public interface IGeminiService
{
    Task<string> GetResponseAsync(string userMessage, CancellationToken cancellationToken = default);
}