﻿using Coms.Application.Services.Common;
using ErrorOr;

namespace Coms.Application.Services.Services
{
    public interface IServiceService
    {
        Task<ErrorOr<ServiceResult>> GetService(int serviceId);
        Task<ErrorOr<IList<ServiceResult>>> GetServicesByName(string? serviceName);
        Task<ErrorOr<ServiceResult>> AddService(string serviceName, string description, double price, int contractCategoryId);
        Task<ErrorOr<ServiceResult>> UpdateService(int serviceId, string serviceName, string description, double price,
                int contractCategoryId);
        Task<ErrorOr<ServiceResult>> DeleteService(int id);
        Task<ErrorOr<IList<ServiceResult>>> GetActiveServices(int? contractCategoryId);
        Task<ErrorOr<PagingResult<ServiceResult>>> GetActiveServicesWithFilter(int? contractCategoryId, string serviceName,
                int currentPage, int pageSize);
        Task<ErrorOr<PagingResult<ServiceResult>>> GetServicesByPartnerID(int? partnerId, int currentPage, int pageSize);
    }
}
