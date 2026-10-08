using ElectronicUnion.Api.Configuration;
using ElectronicUnion.Api.Contracts;
using ElectronicUnion.Api.Services;
using ElectronicUnion.Api.Validators;

namespace ElectronicUnion.Api.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddGeminiServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services
            .AddOptions<GeminiOptions>()
            .Bind(configuration.GetSection(GeminiOptions.SectionName))
            .ValidateDataAnnotations()
            .ValidateOnStart();

        services.AddScoped<IChatRequestValidator, ChatRequestValidator>();
        services.AddHttpClient<IGeminiService, GeminiService>();

        return services;
    }

    public static IServiceCollection AddFrontendCors(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var origins = configuration
            .GetSection("Cors:AllowedOrigins")
            .Get<string[]>() ?? Array.Empty<string>();

        services.AddCors(options =>
        {
            options.AddPolicy("AllowFrontend", policy =>
            {
                policy.WithOrigins(origins)
                      .AllowAnyHeader()
                      .AllowAnyMethod();
            });
        });

        return services;
    }
}