using LaborUnion.Application.UseCases.Farmer.Register;
using LaborUnion.Application.UseCases.Service.Register;
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
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> Register(
            [FromBody] RequestRegisterServiceJson request,
            [FromServices] IRegisterServiceUseCase useCase
            )
        {
            var response = await useCase.Execute(request);

            return Created(string.Empty, response);
        }
    }
}
