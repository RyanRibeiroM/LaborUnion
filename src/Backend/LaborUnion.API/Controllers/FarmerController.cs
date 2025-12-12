using LaborUnion.Application.UseCases.Farmer.Filter;
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
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> Register(
            [FromBody] RequestRegisterFarmerJson request,
            [FromServices] IRegisterFarmerUseCase useCase
            )
        {
            var response = await useCase.Execute(request);

            return Created(string.Empty, response);
        }

        [HttpPost("filter")]
        [ProducesResponseType(typeof(ResponseFarmersJson), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize(Roles = "Administrator")]
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
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> Update(
            [FromServices] IUpdateFarmerUseCase useCase,
            [FromRoute] int id,
            [FromBody] RequestRegisterFarmerJson request
            )
        {
            await useCase.Execute(id, request);

            return NoContent();
        }
    }
}
