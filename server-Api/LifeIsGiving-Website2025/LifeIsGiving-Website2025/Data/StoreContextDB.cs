using LifeIsGiving_Website2025.Models;
using Microsoft.EntityFrameworkCore;

namespace LifeIsGiving_Website2025.Data
{
    public class StoreContextDB:DbContext
    {
        public StoreContextDB(DbContextOptions<StoreContextDB> options) : base(options) { }
        public DbSet<User> Users => Set<User>();
        public DbSet<Prize> Prizes => Set<Prize>();
        public DbSet<Purchase> Purchases => Set<Purchase>();
        public DbSet<Winning> Winnings => Set<Winning>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("Users");
                entity.Property(u => u.UserName)
                      .IsRequired()
                      .HasMaxLength(50);
                entity.Property(u => u.Name)
                      .IsRequired()
                      .HasMaxLength(50);
                entity.Property(u => u.Email)
                      .IsRequired()
                      .HasMaxLength(100);
                entity.Property(u => u.Phone)
                      .HasMaxLength(20);
                entity.Property(u => u.Address)
                      .HasMaxLength(100);
                entity.Property(u => u.Password)
                      .IsRequired()
                      .HasMaxLength(256);
                entity.HasIndex(u => u.UserName).IsUnique();
                entity.HasMany(u => u.PrizesDonated)
                      .WithOne(p => p.Donor)
                      .HasForeignKey(p => p.DonorId);
            });


            // Prize
            modelBuilder.Entity<Prize>(entity =>
            {
                entity.ToTable("Prizes");
                entity.Property(p => p.Name)
                      .IsRequired()
                      .HasMaxLength(100);
                entity.Property(p => p.Description)
                      .IsRequired()
                      .HasMaxLength(500);
                entity.Property(p => p.Category)
                      .IsRequired();
                entity.Property(p => p.Price)
                      .IsRequired()
                      .HasPrecision(18, 2); 
                entity.Property(p => p.ImageUrl)
                      .HasMaxLength(200); 
                entity.Property(p => p.DonorId)
                      .IsRequired();
                entity.HasOne(p => p.Donor)
                      .WithMany() 
                      .HasForeignKey(p => p.DonorId)
                      .OnDelete(DeleteBehavior.Cascade);

            });

            // Purchase
            modelBuilder.Entity<Purchase>(entity =>
            {
                entity.HasIndex(p => new { p.UserId, p.Status });
                entity.HasOne(p => p.User)
                      .WithMany(u => u.Purchases)
                      .HasForeignKey(p => p.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(p => p.Prize)
                      .WithMany(p => p.Purchases)  
                      .HasForeignKey(p => p.PrizeId)
                      .OnDelete(DeleteBehavior.Restrict);
                entity.Property(p => p.PriceAtPurchase)
                       .HasColumnType("decimal(18,2)");
            });

            // Winning
            modelBuilder.Entity<Winning>(entity =>
            {
                entity.ToTable("Winnings");
                entity.Property(w => w.PrizeId).IsRequired();
                entity.Property(w => w.WinnerUserId).IsRequired();
                entity.Property(w => w.LotteryDate).IsRequired();

                entity.HasOne(w => w.Prize)
                      .WithMany()
                      .HasForeignKey(w => w.PrizeId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(w => w.WinnerUser)
                      .WithMany(u => u.Winnings)
                      .HasForeignKey(w => w.WinnerUserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });


        }

    }
}
