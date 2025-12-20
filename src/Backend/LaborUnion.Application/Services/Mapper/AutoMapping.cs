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
            CreateMap<RequestRegisterServiceTypeJson, ServiceType>();
            CreateMap<RequestRegisterSectorJson, Sector>();
            CreateMap<RequestRegisterServiceJson, Service>();
        }

        private void DomainToResponse()
        {
            CreateMap<User, ResponseUserProfileJson>()
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role.ToString()));
            CreateMap<User, ResponseUserJson>()
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role.ToString()));

            CreateMap<Farmer, ResponseRegisteredFarmerJson>();
            CreateMap<Farmer, ResponseFarmerShortJson>();
            CreateMap<Farmer, ResponseFarmerJson>()
                .ForMember(dest => dest.MaritalStatus, opt => opt.MapFrom(src => src.MaritalStatus.ToString()));

            CreateMap<ServiceType, ResponseRegisteredServiceTypeJson>();
            CreateMap<ServiceType, ResponseServiceTypeJson>();
            CreateMap<ServiceType, ResponseServiceTypeShortJson>();

            CreateMap<Service, ResponseServiceJson>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
                .ForMember(dest => dest.ServiceTypeName, opt => opt.MapFrom(src => src.ServiceType.Name))
                .ForMember(dest => dest.FarmerName, opt => opt.MapFrom(src => src.Farmer.Name))
                .ForMember(dest => dest.FarmerCpf, opt => opt.MapFrom(src => src.Farmer.Cpf))
                .ForMember(dest => dest.SectorName, opt => opt.MapFrom(src => src.Sector.Name))
                .ForMember(dest => dest.SectorName, opt => opt.MapFrom(src => src.Sector.Name))
                .ForMember(dest => dest.AttendantName, opt => opt.MapFrom(src => src.Attendant.Name));

            CreateMap<Service, ResponseServiceShortJson>()
                .ForMember(dest => dest.FarmerName, opt => opt.MapFrom(src => src.Farmer.Name))
                .ForMember(dest => dest.SectorName, opt => opt.MapFrom(src => src.Sector.Name))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));


            CreateMap<Sector, ResponseRegisteredSectorJson>();
            CreateMap<Sector, ResponseSectorJson>();
            CreateMap<Sector, ResponseSectorShortJson>();
        }
    }
}