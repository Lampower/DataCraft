using Backend.Database.Models;
using Backend.Dtos.GetDtos;

namespace Backend.Repositories.Interfaces
{
    public interface IBaseRepository<T> where T: BaseEntity
    {
        Task<T> Create(T entity);
        Task<T> GetById(int id);
        Task<List<T>> GetAll();
        Task<PaginatedEntitiesDto<T>> GetAllPaginated(int from, int amount);
        Task<bool> Delete(int id);
    }
}
