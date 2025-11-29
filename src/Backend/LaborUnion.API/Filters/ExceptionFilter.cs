using LaborUnion.Communication.Responses;
using LaborUnion.Exceptions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace LaborUnion.API.Filters
{
    public class ExceptionFilter : IExceptionFilter
    {
        public void OnException(ExceptionContext context)
        {
            if (context.Exception is LaborUnionException exception)
                HandleProjectException(context, exception);
            //else
            //    ThrowUnknownError(context);
        }

        private void HandleProjectException(ExceptionContext context, LaborUnionException exception)
        {
            context.HttpContext.Response.StatusCode = (int)exception.GetStatusCode();
            var responseJson = new ResponseErrorJson(exception.GetErrorMessages());
            context.Result = new ObjectResult(responseJson);
        }

        private void ThrowUnknownError(ExceptionContext context)
        {
            context.HttpContext.Response.StatusCode = StatusCodes.Status500InternalServerError;
            var responseJson = new ResponseErrorJson(ResourceMessagesException.UNKNOWN_ERROR);
            context.Result = new ObjectResult(responseJson);
        }
    }
}
