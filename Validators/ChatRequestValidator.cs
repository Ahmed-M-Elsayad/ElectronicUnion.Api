using ElectronicUnion.Api.Contracts;
using ElectronicUnion.Api.Models;

namespace ElectronicUnion.Api.Validators;

public sealed class ChatRequestValidator : IChatRequestValidator
{
    private const int MaxMessageLength = 500;

    public ValidationResult Validate(ChatRequest request)
    {
        if (request is null)
            return ValidationResult.Failure("Request body is required.");

        var message = request.Message?.Trim();

        if (string.IsNullOrWhiteSpace(message))
            return ValidationResult.Failure("Message cannot be empty.");

        if (message.Length > MaxMessageLength)
            return ValidationResult.Failure($"Message cannot exceed {MaxMessageLength} characters.");

        if (message.Any(ch => char.IsControl(ch) && ch != '\n' && ch != '\r' && ch != '\t'))
            return ValidationResult.Failure("Message contains invalid characters.");

        return ValidationResult.Success();
    }
}