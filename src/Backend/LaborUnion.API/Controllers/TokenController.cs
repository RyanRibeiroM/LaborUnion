using LaborUnion.Application.UseCases.Token.RefreshToken;
using LaborUnion.Communication.Requests;
using LaborUnion.Communication.Responses;
using Microsoft.AspNetCore.Mvc;

namespace LaborUnion.API.Controllers
{
    public class TokenController : LaborUnionBaseController
    {
        [HttpPost("refresh-token")]
        [ProducesResponseType(typeof(ResponseTokensJson), StatusCodes.Status200OK)]
        public async Task<IActionResult> RefreshToken(
            [FromServices] IUserRefreshTokenUseCase usecase,
            [FromBody] RequestNewTokenJson request)
        {
            var response = await usecase.Execute(request);
            return Ok(response);
        }
    }
}
