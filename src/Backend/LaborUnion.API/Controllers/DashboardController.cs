using LaborUnion.Application.UseCases.Dashboard.Accountant;
using LaborUnion.Application.UseCases.Dashboard.GetDocument;
using LaborUnion.Application.UseCases.Dashboard.GetSector;
using LaborUnion.Application.UseCases.Dashboard.GetServiceType;
using LaborUnion.Communication.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LaborUnion.API.Controllers
{
    public class DashboardController : LaborUnionBaseController
    {
        [HttpGet("Accountants")]
        [ProducesResponseType(typeof(ResponseAccountantsJson), StatusCodes.Status200OK)]
        [Authorize]
        public async Task<IActionResult> Accountants([FromServices] IGetDashboardAccountantsUseCase useCase)
        {
            var response = await useCase.Execute();

             return Ok(response);
        }

        [HttpGet("Document")]
        [ProducesResponseType(typeof(ResponseDocumentsJson), StatusCodes.Status200OK)]
        [Authorize]
        public async Task<IActionResult> GetDocument([FromServices] IGetDashboardDocumentUseCase useCase)
        {
            var response = await useCase.Execute();

            return Ok(response);
        }

        [HttpGet("Sector")]
        [ProducesResponseType(typeof(ResponseChartDatasJson), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize]
        public async Task<IActionResult> GetSectorToChar([FromServices] IGetDashboardSectorUseCase useCase)
        {
            var response = await useCase.Execute();

            if (response.ChartData.Any())
            {
                return Ok(response);
            }

            return NoContent();
        }

        [HttpGet("ServiceType")]
        [ProducesResponseType(typeof(ResponseChartDatasJson), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize]
        public async Task<IActionResult> GetServiceTypeToChar([FromServices] IGetDashboardServiceTypeUseCase useCase)
        {
            var response = await useCase.Execute();

            if (response.ChartData.Any())
            {
                return Ok(response);
            }

            return NoContent();
        }
    }
}
