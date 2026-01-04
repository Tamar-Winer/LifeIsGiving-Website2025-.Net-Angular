using Xunit;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using LifeIsGiving_Website2025.Data;
using LifeIsGiving_Website2025.Repositories;
using LifeIsGiving_Website2025.Models;

public class PrizeRepositoryTests
{
    private StoreContextDB GetDbContext()
    {
        var options = new DbContextOptionsBuilder<StoreContextDB>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new StoreContextDB(options);
    }

    [Fact]
    public async Task AddPrize_ShouldAddPrizeToDatabase()
    {
        // Arrange
        var context = GetDbContext();
        var repository = new PrizeRepository(context);

        var prize = new Prize
        {
            Name = "Test Prize",
            DonorId = 1,
            CanPurchase = true
        };

        // Act
        await repository.AddPrize(prize);

        // Assert
        var prizes = await context.Prizes.ToListAsync();
        prizes.Should().HaveCount(1);
        prizes[0].Name.Should().Be("Test Prize");
    }
}
