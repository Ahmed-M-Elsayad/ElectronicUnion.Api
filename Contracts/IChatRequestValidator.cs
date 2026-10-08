using ElectronicUnion.Api.Models;

namespace ElectronicUnion.Api.Contracts;

public interface IChatRequestValidator
{
    ValidationResult Validate(ChatRequest request);
}

public sealed record ValidationResult(bool IsValid, string? ErrorMessage)
{
    public static ValidationResult Success() => new(true, null);
    public static ValidationResult Failure(string message) => new(false, message);
}