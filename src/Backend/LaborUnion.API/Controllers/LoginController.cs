using LaborUnion.Application.UseCases.Login.DoLogin;
using LaborUnion.Communication.Responses;
using LaborUnion.Communication.Requests;
using Microsoft.AspNetCore.Mvc;

namespace LaborUnion.API.Controllers
{
    public class LoginController : LaborUnionBaseController
    {
        [HttpPost]
        [ProducesResponseType(typeof(ResponseRegisteredUserJson), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Login(
            [FromBody] RequestLoginJson request,
            [FromServices] IDoLoginUseCase useCase)
        {
            var response = await useCase.Execute(request);

            return Ok(response);
        }
    }
}
