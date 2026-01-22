using LaborUnion.Application.UseCases.Document.Delete;
using LaborUnion.Application.UseCases.Document.Filter;
using LaborUnion.Application.UseCases.Document.GetById;
using LaborUnion.Application.UseCases.Document.Register;
using LaborUnion.Application.UseCases.Document.Update;
using LaborUnion.Communication.Requests;
using LaborUnion.Communication.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LaborUnion.API.Controllers
{
    public class DocumentController : LaborUnionBaseController
    {
        [HttpPost]
        [ProducesResponseType(typeof(ResponseRegisteredDocumentJson), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status400BadRequest)]
        [Authorize]
        public async Task<IActionResult> Register(
            [FromBody] RequestRegisterDocumentJson request,
            [FromServices] IRegisterDocumentUseCase useCase
            )
        {
            var response = await useCase.Execute(request);

            return Created(string.Empty, response);
        }

        [HttpDelete]
        [Route("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status404NotFound)]
        [Authorize]
        public async Task<IActionResult> Delete(
            [FromServices] IDeleteDocumentUseCase useCase,
            [FromRoute] int id)
        {
            await useCase.Execute(id);

            return NoContent();
        }

        [HttpPost("filter")]
        [ProducesResponseType(typeof(ResponseDocumentsJson), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize]
        public async Task<IActionResult> Filter(
            [FromServices] IFilterDocumentUseCase useCase,
            [FromBody] RequestFilterDocumentJson request)
        {
            var response = await useCase.Execute(request);

            if (response.Documents.Any())
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
            [FromServices] IUpdateDocumentUseCase useCase,
            [FromRoute] int id,
            [FromBody] RequestUpdateDocumentJson request
            )
        {
            await useCase.Execute(id, request);

            return NoContent();
        }

        [HttpGet]
        [Route("{id}")]
        [ProducesResponseType(typeof(ResponseDocumentJson), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status404NotFound)]
        [Authorize]
        public async Task<IActionResult> GetById(
            [FromServices] IGetDocumentByIdUseCase useCase,
            [FromRoute] int id)
        {
            var response = await useCase.Execute(id);

            return Ok(response);
        }
    }
}
