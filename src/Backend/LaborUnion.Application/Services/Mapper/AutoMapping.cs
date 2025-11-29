using AutoMapper;
using LaborUnion.Communication.Responses;
using LaborUnion.Communication.Requests;
using LaborUnion.Domain.Entities;

namespace LaborUnion.Application.Services.Mapper
{
    public class AutoMapping : Profile
    {
        public AutoMapping()
        {
            RequestToDomain();
            DomainToResponse();
        }

        private void RequestToDomain()
        {
            CreateMap<RequestRegisterUserJson, User>()
                .ForMember(dest => dest.Password, opt => opt.Ignore());
            CreateMap<RequestRegisterFarmerJson, Farmer>();
        }

        private void DomainToResponse()
        {
            CreateMap<User, ResponseUserProfileJson>()
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role.ToString()));

            CreateMap<User, ResponseUserJson>()
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role.ToString()));

            CreateMap<Farmer, ResponseRegisteredFarmerJson>();
        }
    }
}