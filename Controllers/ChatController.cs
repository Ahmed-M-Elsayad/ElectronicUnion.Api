using ElectronicUnion.Api.Contracts;
using ElectronicUnion.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace ElectronicUnion.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class ChatController : ControllerBase
{
    private readonly IGeminiService _geminiService;
    private readonly IChatRequestValidator _validator;

    public ChatController(IGeminiService geminiService, IChatRequestValidator validator)
    {
        _geminiService = geminiService;
        _validator = validator;
    }

    [HttpPost]
    [ProducesResponseType(typeof(ChatResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Ask(
        [FromBody] ChatRequest request,
        CancellationToken cancellationToken)
    {
        var validation = _validator.Validate(request);
        if (!validation.IsValid)
            return BadRequest(new ErrorResponse(validation.ErrorMessage!));

        try
        {
            var reply = await _geminiService.GetResponseAsync(request.Message, cancellationToken);
            return Ok(new ChatResponse(reply));
        }
        catch (Exception)
        {
            return StatusCode(
                StatusCodes.Status502BadGateway,
                new ErrorResponse("The AI service is temporarily unavailable."));
        }
    }
}