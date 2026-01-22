using LaborUnion.Application.UseCases.Farmer.Delete;
using LaborUnion.Application.UseCases.Farmer.Filter;
using LaborUnion.Application.UseCases.Farmer.GetById;
using LaborUnion.Application.UseCases.Farmer.Register;
using LaborUnion.Application.UseCases.Farmer.Update;
using LaborUnion.Communication.Requests;
using LaborUnion.Communication.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LaborUnion.API.Controllers
{
    public class FarmerController : LaborUnionBaseController
    {
        [HttpPost]
        [ProducesResponseType(typeof(ResponseRegisteredFarmerJson), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status400BadRequest)]
        [Authorize]
        public async Task<IActionResult> Register(
            [FromBody] RequestRegisterFarmerJson request,
            [FromServices] IRegisterFarmerUseCase useCase
            )
        {
            var response = await useCase.Execute(request);

            return Created(string.Empty, response);
        }

        [HttpGet]
        [Route("{id}")]
        [ProducesResponseType(typeof(ResponseFarmerJson), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status404NotFound)]
        [Authorize]
        public async Task<IActionResult> GetById(
            [FromServices] IGetFarmerByIdUseCase useCase,
            [FromRoute] int id)
        {
            var response = await useCase.Execute(id);

            return Ok(response);
        }

        [HttpPost("filter")]
        [ProducesResponseType(typeof(ResponseFarmersJson), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize]
        public async Task<IActionResult> Filter(
            [FromServices] IFilterFarmerUseCase useCase,
            [FromBody] RequestFilterFarmerJson request)
        {
            var response = await useCase.Execute(request);

            if (response.Farmers.Any())
            {
                return Ok(response);
            }

            return NoContent();
        }

        [HttpPut]
        [Route("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status404NotFound)]
        [Authorize]
        public async Task<IActionResult> Update(
            [FromServices] IUpdateFarmerUseCase useCase,
            [FromRoute] int id,
            [FromBody] RequestRegisterFarmerJson request
            )
        {
            await useCase.Execute(id, request);

            return NoContent();
        }

        [HttpDelete]
        [Route("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status404NotFound)]
        [Authorize]
        public async Task<IActionResult> Delete(
            [FromServices] IDeleteFarmerUseCase useCase,
            [FromRoute] int id)
        {
            await useCase.Execute(id);

            return NoContent();
        }
    }
}
