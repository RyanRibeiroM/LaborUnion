using LaborUnion.Application.UseCases.Sector.GetById;
using LaborUnion.Application.UseCases.Service.Update;
using LaborUnion.Application.UseCases.ServiceType.Delete;
using LaborUnion.Application.UseCases.ServiceType.Filter;
using LaborUnion.Application.UseCases.ServiceType.GetById;
using LaborUnion.Application.UseCases.ServiceType.Resgister;
using LaborUnion.Application.UseCases.ServiceType.Update;
using LaborUnion.Communication.Requests;
using LaborUnion.Communication.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LaborUnion.API.Controllers
{
    public class ServiceTypeController : LaborUnionBaseController
    {
        [HttpPost]
        [ProducesResponseType(typeof(ResponseRegisteredServiceTypeJson), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status400BadRequest)]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> Register(
            [FromBody] RequestRegisterServiceTypeJson request,
            [FromServices] IRegisterServiceTypeUseCase useCase
            )
        {
            var response = await useCase.Execute(request);

            return Created(string.Empty, response);
        }

        [HttpGet]
        [Route("{id}")]
        [ProducesResponseType(typeof(ResponseServiceTypeJson), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status404NotFound)]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> GetById(
            [FromServices] IGetServiceTypeByIdUseCase useCase,
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
            [FromServices] IDeleteServiceTypeUseCase useCase,
            [FromRoute] int id)
        {
            await useCase.Execute(id);

            return NoContent();
        }

        [HttpPut]
        [Route("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status404NotFound)]
        [Authorize(Roles = "Administrator, Attendant")]
        public async Task<IActionResult> Update(
            [FromServices] IUpdateServiceTypeUseCase useCase,
            [FromRoute] int id,
            [FromBody] RequestUpdateServiceTypeJson request
            )
        {
            await useCase.Execute(id, request);

            return NoContent();
        }

        [HttpPost("filter")]
        [ProducesResponseType(typeof(ResponseServicesTypesJson), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> Filter(
            [FromServices] IFilterServiceTypeUseCase useCase,
            [FromBody] RequestFilterServiceTypeJson request)
        {
            var response = await useCase.Execute(request);

            if (response.ServicesTypes.Any())
            {
                return Ok(response);
            }

            return NoContent();
        }
    }
}
