using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Entities;

namespace Repositories {

    public partial class DashGen2026Context : DbContext
    {
        public DashGen2026Context()
        {
        }

        public DashGen2026Context(DbContextOptions<DashGen2026Context> options)
            : base(options)
        {
        }

        public virtual DbSet<Category> Categories { get; set; }

        public virtual DbSet<Order> Orders { get; set; }

        public virtual DbSet<OrdersItem> OrdersItems { get; set; }

        public virtual DbSet<Product> Products { get; set; }

        public virtual DbSet<Rating> Ratings { get; set; }

        public virtual DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(e => e.CategoryId).HasName("PK__Categori__19093A2B28724438");

                entity.HasIndex(e => e.CategoryName, "UQ__Categori__8517B2E02AF12802").IsUnique();

                entity.Property(e => e.CategoryId).HasColumnName("CategoryID");
                entity.Property(e => e.CategoryName)
                    .HasMaxLength(100)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasKey(e => e.OrderId).HasName("PK__Orders__C3905BAF3FF817BB");

                entity.Property(e => e.OrderId).HasColumnName("OrderID");
                entity.Property(e => e.CurrentStatus).HasColumnName("currentStatus");
                entity.Property(e => e.GeneratedCode).IsUnicode(false);
                entity.Property(e => e.OrderDate).HasDefaultValueSql("(getdate())");
                entity.Property(e => e.OriginalSchema).IsUnicode(false);
                entity.Property(e => e.UserId).HasColumnName("UserID");

                entity.HasOne(d => d.User).WithMany(p => p.Orders)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Orders__UserID__07C12930");
            });

            modelBuilder.Entity<OrdersItem>(entity =>
            {
                entity.HasKey(e => e.OrderItemId).HasName("PK__Orders_I__57ED06A1F9A79E8E");

                entity.ToTable("Orders_Items");

                entity.Property(e => e.OrderItemId).HasColumnName("OrderItemID");
                entity.Property(e => e.OrderId).HasColumnName("OrderID");
                entity.Property(e => e.ProductId).HasColumnName("ProductID");

                entity.HasOne(d => d.Order).WithMany(p => p.OrdersItems)
                    .HasForeignKey(d => d.OrderId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Orders_It__Order__0D7A0286");

                entity.HasOne(d => d.Product).WithMany(p => p.OrdersItems)
                    .HasForeignKey(d => d.ProductId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Orders_It__Produ__0C85DE4D");
            });

            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasKey(e => e.ProductId).HasName("PK__Products__B40CC6ED71E81750");

                entity.HasIndex(e => e.ImgUrl, "UQ__Products__1BCAF4FC117658DE").IsUnique();

                entity.HasIndex(e => e.ProductName, "UQ__Products__DD5A978ADAF02BBF").IsUnique();

                entity.Property(e => e.ProductId).HasColumnName("ProductID");
                entity.Property(e => e.CategoryId).HasColumnName("CategoryID");
                entity.Property(e => e.ImgUrl)
                    .HasMaxLength(200)
                    .IsUnicode(false);
                entity.Property(e => e.ProductDescreption).IsUnicode(false);
                entity.Property(e => e.ProductName)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.HasOne(d => d.Category).WithMany(p => p.Products)
                    .HasForeignKey(d => d.CategoryId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Products__Catego__00200768");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.UserId).HasName("PK__Users__1788CCAC16B395D3");

                entity.HasIndex(e => e.UserName, "UQ__Users__C9F284569E96BDFD").IsUnique();

                entity.Property(e => e.UserId).HasColumnName("UserID");
                entity.Property(e => e.FirstName)
                    .HasMaxLength(100)
                    .IsUnicode(false);
                entity.Property(e => e.LastName)
                    .HasMaxLength(100)
                    .IsUnicode(false);
                entity.Property(e => e.Password)
                    .HasMaxLength(100)
                    .IsUnicode(false);
                entity.Property(e => e.UserName)
                    .HasMaxLength(100)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Rating>(entity =>
            {
                entity.ToTable("RATING");
                entity.Property(e => e.RatingId).HasColumnName("RATING_ID");
                entity.Property(e => e.Host).HasColumnName("HOST").HasMaxLength(50);
                entity.Property(e => e.Method).HasColumnName("METHOD").HasMaxLength(10).IsFixedLength();
                entity.Property(e => e.Path).HasColumnName("PATH").HasMaxLength(50);
                entity.Property(e => e.RecordDate).HasColumnName("Record_Date").HasColumnType("datetime");
                entity.Property(e => e.Referer).HasColumnName("REFERER").HasMaxLength(100);
                entity.Property(e => e.UserAgent).HasColumnName("USER_AGENT");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
