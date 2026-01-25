using LaborUnion.Application.UseCases.Service.Delete;
using LaborUnion.Application.UseCases.Service.Filter;
using LaborUnion.Application.UseCases.Service.GetById;
using LaborUnion.Application.UseCases.Service.Register;
using LaborUnion.Application.UseCases.Service.Update;
using LaborUnion.Communication.Requests;
using LaborUnion.Communication.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LaborUnion.API.Controllers
{
    public class ServiceController : LaborUnionBaseController
    {
        [HttpPost]
        [ProducesResponseType(typeof(ResponseRegisteredServiceJson), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status400BadRequest)]
        [Authorize]
        public async Task<IActionResult> Register(
            [FromBody] RequestRegisterServiceJson request,
            [FromServices] IRegisterServiceUseCase useCase
            )
        {
            var response = await useCase.Execute(request);

            return Created(string.Empty, response);
        }

        [HttpGet]
        [Route("{id}")]
        [ProducesResponseType(typeof(ResponseServiceJson), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status404NotFound)]
        [Authorize]
        public async Task<IActionResult> GetById(
            [FromServices] IGetServiceByIdUseCase useCase,
            [FromRoute] int id)
        {
            var response = await useCase.Execute(id);

            return Ok(response);
        }

        [HttpPost("filter")]
        [ProducesResponseType(typeof(ResponseServicesJson), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize]
        public async Task<IActionResult> Filter(
            [FromServices] IFilterServiceUseCase useCase,
            [FromBody] RequestFilterServiceJson request)
        {
            var response = await useCase.Execute(request);

            if (response.Services.Any())
            {
                return Ok(response);
            }

            return NoContent();
        }

        [HttpDelete]
        [Route("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status404NotFound)]
        [Authorize]
        public async Task<IActionResult> Delete(
            [FromServices] IDeleteServiceUseCase useCase,
            [FromRoute] int id)
        {
            await useCase.Execute(id);

            return NoContent();
        }

        [HttpPut]
        [Route("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status404NotFound)]
        [Authorize]
        public async Task<IActionResult> Update(
            [FromServices] IUpdateServiceUseCase useCase,
            [FromRoute] int id,
            [FromBody] RequestUpdateServiceJson request
            )
        {
            await useCase.Execute(id, request);

            return NoContent();
        }
    }
}
