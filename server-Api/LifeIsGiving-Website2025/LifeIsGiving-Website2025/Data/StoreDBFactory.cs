using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace LifeIsGiving_Website2025.Data
{
    public class StoreContextDBFactory
       : IDesignTimeDbContextFactory<StoreContextDB>
    {
        public StoreContextDB CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<StoreContextDB>();

            optionsBuilder.UseSqlServer(
                "Server=localhost;Database=LifeIsGivingDB;Trusted_Connection=True;TrustServerCertificate=True;"
            );

            return new StoreContextDB(optionsBuilder.Options);
        }
    }
}
