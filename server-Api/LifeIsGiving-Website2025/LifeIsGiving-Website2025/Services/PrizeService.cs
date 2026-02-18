using LifeIsGiving_Website2025.Dtos;
using LifeIsGiving_Website2025.Interfaces;
using LifeIsGiving_Website2025.Models;
using LifeIsGiving_Website2025.Repositories;

namespace LifeIsGiving_Website2025.Services
{
    public class PrizeService : IPrizeService
    {
        private readonly IPrizeRepository _repo;

        public PrizeService(IPrizeRepository repo)
        {
            _repo = repo;
        }

        public async Task<List<PrizeDto>> GetPrizes(string? search = null)
        {
            var prizes = await _repo.GetPrizes(search);

            return prizes.Select(p => new PrizeDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Category = p.Category,
                Price = p.Price,
                ImageUrl = p.ImageUrl,
                DonorId = p.DonorId,
                DonorName = p.Donor.Name,
                CanPurchase = p.CanPurchase
            }).ToList();
        }

        public async Task<PrizeDto?> GetPrizeById(int id)
        {
            var p = await _repo.GetPrizeById(id);
            if (p == null) return null;

            return new PrizeDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Category = p.Category,
                Price = p.Price,
                ImageUrl = p.ImageUrl,
                DonorId = p.DonorId,
                DonorName = p.Donor.Name,
                CanPurchase = p.CanPurchase
            };
        }

        public async Task AddPrize(PrizeCreateDto dto)
        {
            var prize = new Prize
            {
                Name = dto.Name,
                Description = dto.Description,
                Category = dto.Category,
                Price = dto.Price,
                ImageUrl = dto.ImageUrl,
                DonorId = dto.DonorId
            };

            await _repo.AddPrize(prize);
        }

        public async Task UpdatePrize(int id, PrizeCreateDto dto)
        {
            var prize = await _repo.GetPrizeById(id);
            if (prize == null) return;

            prize.Name = dto.Name;
            prize.Description = dto.Description;
            prize.Category = dto.Category;
            prize.Price = dto.Price;
            prize.ImageUrl = dto.ImageUrl;
            prize.DonorId = dto.DonorId;


            await _repo.UpdatePrize(prize);
        }

        public async Task DeletePrize(int id)
        {
            var prize = await _repo.GetPrizeById(id);
            if (prize == null) return;

            await _repo.DeletePrize(prize);
        }
        public async Task<List<PrizeSearchDto>> SearchPrizes(string? prizeName = null, string? donorName = null, int? exactBuyers = null)
        {
            return await _repo.SearchPrizes(prizeName, donorName, exactBuyers);
        }

    }
}
