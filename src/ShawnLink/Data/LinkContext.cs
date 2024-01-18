using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace ShawnLink.Data;

public class LinkContext : DbContext
{
  private readonly ShawnConfiguration _config;

  public LinkContext(ShawnConfiguration config)
  {
    _config=config;
  }

  public DbSet<Link> Links { get; set; }
  public DbSet<Redirect> Redirects { get; set; }

  protected override void OnModelCreating(ModelBuilder bldr)
  {
    base.OnModelCreating(bldr);

    var linkBldr = bldr.Entity<Link>().ToTable("Links", "Shawn");

    linkBldr.Property(l => l.Key).HasMaxLength(100).IsRequired();
    linkBldr.Property(l => l.Url).HasMaxLength(1024).IsRequired();
    linkBldr.Property(l => l.Domain).HasMaxLength(25).IsRequired();

    var redirectBldr = bldr.Entity<Redirect>().ToTable("Redirects", "Shawn");
    redirectBldr.Property(r => r.Key).HasMaxLength(100).IsRequired();
    redirectBldr.Property(r => r.Origin).HasMaxLength(255);
    redirectBldr.Property(r => r.Referer).HasMaxLength(255);
    redirectBldr.Property(r => r.QueryString).HasMaxLength(255);
    redirectBldr.Property(r => r.Comments).HasMaxLength(1024);
    redirectBldr.Property(r => r.Destination).HasMaxLength(1024).IsRequired();
    redirectBldr.Property(r => r.Domain).HasMaxLength(100).IsRequired();
  }

  protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
  {
    optionsBuilder.UseSqlServer(_config.Storage.ConnectionString);
  }

}
