using LaborUnion.Application.UseCases.Farmer.Filter;
using LaborUnion.Application.UseCases.Sector.AddUser;
using LaborUnion.Application.UseCases.Sector.Delete;
using LaborUnion.Application.UseCases.Sector.Filter;
using LaborUnion.Application.UseCases.Sector.GetById;
using LaborUnion.Application.UseCases.Sector.Register;
using LaborUnion.Application.UseCases.Sector.RemovePermission;
using LaborUnion.Application.UseCases.Sector.Update;
using LaborUnion.Communication.Requests;
using LaborUnion.Communication.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LaborUnion.API.Controllers
{
    public class SectorController : LaborUnionBaseController
    {
        [HttpPost]
        [ProducesResponseType(typeof(ResponseRegisteredSectorJson), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status400BadRequest)]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> Register(
            [FromBody] RequestRegisterSectorJson request,
            [FromServices] IRegisterSectorUseCase useCase
            )
        {
            var response = await useCase.Execute(request);

            return Created(string.Empty, response);
        }

        [HttpGet]
        [Route("{id}")]
        [ProducesResponseType(typeof(ResponseSectorJson), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status404NotFound)]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> GetById(
            [FromServices] IGetSectorByIdUseCase useCase,
            [FromRoute] int id)
        {
            var response = await useCase.Execute(id);

            return Ok(response);
        }

        [HttpDelete]
        [Route("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status409Conflict)]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> Delete(
            [FromServices] IDeleteSectorUseCase useCase,
            [FromRoute] int id)
        {
            await useCase.Execute(id);

            return NoContent();
        }

        [HttpPut]
        [Route("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status404NotFound)]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> Update(
            [FromServices] IUpdateSectorUseCase useCase,
            [FromRoute] int id,
            [FromBody] RequestRegisterSectorJson request
            )
        {
            await useCase.Execute(id, request);

            return NoContent();
        }

        [HttpPost]
        [Route("{id}/users")]
        [ProducesResponseType(typeof(ResponseRegisteredSectorUserJson), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status409Conflict)]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> RegisterUserToSector(
            [FromServices] IRegisterUserToSectorUseCase useCase,
            [FromRoute] int id,
            [FromBody] RequestRegisterUserToSectorJson request
            )
        {
            var response = await useCase.Execute(id, request);

            return Created(string.Empty, response);
        }

        [HttpDelete]
        [Route("{sectorId}/users/{userId}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status404NotFound)]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> RemovePermission(
            [FromServices] IRemovePermissionUserToSectorUseCase useCase,
            [FromRoute] int sectorId,
            [FromRoute] int userId
            )
        {
            await useCase.Execute(sectorId, userId);

            return NoContent();
        }

        [HttpPost("filter")]
        [ProducesResponseType(typeof(ResponseSectorsJson), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> Filter(
            [FromServices] IFilterSectorUseCase useCase,
            [FromBody] RequestFilterSectorJson request)
        {
            var response = await useCase.Execute(request);

            if (response.Sectors.Any())
            {
                return Ok(response);
            }

            return NoContent();
        }
    }
}
