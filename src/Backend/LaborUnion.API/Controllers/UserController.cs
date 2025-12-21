using LaborUnion.Application.UseCases.Farmer.Delete;
using LaborUnion.Application.UseCases.Farmer.GetById;
using LaborUnion.Application.UseCases.Farmer.Update;
using LaborUnion.Application.UseCases.User.ChangePassword;
using LaborUnion.Application.UseCases.User.Delete;
using LaborUnion.Application.UseCases.User.Filter;
using LaborUnion.Application.UseCases.User.GetById;
using LaborUnion.Application.UseCases.User.Profile;
using LaborUnion.Application.UseCases.User.Register;
using LaborUnion.Application.UseCases.User.Update;
using LaborUnion.Application.UseCases.User.UpdateProfile;
using LaborUnion.Communication.Requests;
using LaborUnion.Communication.Responses;
using Microsoft.AspNetCore.Authorization;
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

        [HttpGet("Profile")]
        [ProducesResponseType(typeof(ResponseUserProfileJson), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [Authorize]
        public async Task<IActionResult> GetProfile(
            [FromServices] IGetUserProfileUseCase useCase
            )
        {
            var response = await useCase.Execute();
            return Ok(response);

        }

        [HttpGet]
        [Route("{id}")]
        [ProducesResponseType(typeof(ResponseUserJson), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status404NotFound)]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> GetById(
            [FromServices] IGetUserByIdUseCase useCase,
            [FromRoute] int id)
        {
            var response = await useCase.Execute(id);

            return Ok(response);
        }

        [HttpDelete]
        [Route("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status404NotFound)]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> Delete(
            [FromServices] IDeleteUserUseCase useCase,
            [FromRoute] int id)
        {
            await useCase.Execute(id);

            return NoContent();
        }

        [HttpPut("change-password")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status400BadRequest)]
        [Authorize]
        public async Task<IActionResult> ChangeSenha(
            [FromServices] IChangePasswordUseCase usecase,
            [FromBody] RequestChangePasswordJson request)
        {
            await usecase.Execute(request);
            return NoContent();
        }

        [HttpPost("Filter")]
        [ProducesResponseType(typeof(ResponseUsersJson), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> Filter(
            [FromBody] RequestFilterUserJson request,
            [FromServices] IFilterUserUseCase useCase
            )
        {
            var response = await useCase.Execute(request);

            if (response.Users.Any())
            {
                return Ok(response);
            }

            return NoContent();
        }

        [HttpPut]
        [Route("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status404NotFound)]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> Update(
            [FromServices] IUpdateUserUseCase useCase,
            [FromRoute] int id,
            [FromBody] RequestUpdateUserJson request
            )
        {
            await useCase.Execute(id, request);

            return NoContent();
        }

        [HttpPut]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status404NotFound)]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> UpdateProfile(
            [FromServices] IUpdateUserProfileUseCase useCase,
            [FromBody] RequestUpdateUserProfileJson request
            )
        {
            await useCase.Execute(request);

            return NoContent();
        }
    }
}
