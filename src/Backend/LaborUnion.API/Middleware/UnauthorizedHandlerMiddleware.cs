using LaborUnion.Communication.Responses;
using System.Text.Json;

namespace LaborUnion.API.Middlewares
{
    public class UnauthorizedHandlerMiddleware
    {
        private readonly RequestDelegate _next;

        public UnauthorizedHandlerMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            await _next(context);

            if (context.Response.StatusCode == StatusCodes.Status401Unauthorized)
            {
                if (!context.Response.HasStarted)
                {
                    context.Response.ContentType = "application/json";

                    var unauthorizedException =new Exceptions.ExceptionsBase.UnauthorizedAccessException();

                    var responseError = new ResponseErrorJson(unauthorizedException.GetErrorMessages());


                    var jsonOptions = new JsonSerializerOptions
                    {
                        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                    };

                    var responseJson = JsonSerializer.Serialize(responseError, jsonOptions);

                    await context.Response.WriteAsync(responseJson);
                }
            }
        }
    }
}