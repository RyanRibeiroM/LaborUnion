using LaborUnion.Application.UseCases.User.Register;
using LaborUnion.Communication.Reponses;
using LaborUnion.Communication.Requests;
using Microsoft.AspNetCore.Mvc;

namespace LaborUnion.API.Controllers
{
    public class UserController : LaborUnionBaseController
    {
        [HttpPost]
        [ProducesResponseType(typeof(ResponseRegisteredUserJson), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Register(
            [FromBody] RequestRegisterUserJson request,
            [FromServices] IRegisterUserUseCase useCase
            )
        {
            var response = await useCase.Execute(request);

            return Created(string.Empty, response);
        }

        //[HttpGet("Profile")]
        //[ProducesResponseType(typeof(ResponseUserProfileJson), StatusCodes.Status200OK)]
        //[ProducesResponseType(StatusCodes.Status401Unauthorized)]
        //[Authorize]
        //public async Task<IActionResult> GetProfile(
        //    [FromServices] IGetUserProfileUseCase useCase
        //    )
        //{
        //    var response = await useCase.Execute();
        //    return Ok(response);

        //}

        //[HttpPost("Filter")]
        //[ProducesResponseType(typeof(ResponseUserListJson), StatusCodes.Status200OK)]
        //[ProducesResponseType(StatusCodes.Status401Unauthorized)]
        //[ProducesResponseType(StatusCodes.Status403Forbidden)]
        //[Authorize(Roles = "Administrator")]
        //public async Task<IActionResult> Filter(
        //    [FromBody] RequestFilterUserJson request,
        //    [FromServices] IFilterUserUseCase useCase
        //    )
        //{
        //    var response = await useCase.Execute(request);
        //    return Ok(response);

        //}
    }
}
