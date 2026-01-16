# .NET Web API Configuration for HD Print Tag System

## 📋 Overview
การกำหนดค่าและการสร้าง .NET Web API สำหรับระบบพิมพ์ป้ายฉลากจัมโบ้ HDPE/PP/PPC

**Tech Stack:**
- .NET 8.0 Web API
- Entity Framework Core
- SQL Server
- AutoMapper
- Swagger/OpenAPI

---

## 🏗️ Project Structure

```
HDPrintTagAPI/
├── Controllers/
│   ├── UnitsController.cs
│   ├── GradesController.cs
│   └── NetWeightsController.cs
├── Models/
│   ├── Entities/
│   ├── DTOs/
│   └── ViewModels/
├── Data/
│   ├── ApplicationDbContext.cs
│   └── SeedData.cs
├── Services/
│   └── Interfaces/
├── Configuration/
│   └── AutoMapperProfile.cs
├── appsettings.json
└── Program.cs
```

---

## 🗄️ Entity Models

### 1. **Unit.cs** (Entity)
```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HDPrintTagAPI.Models.Entities
{
    [Table("Units")]
    public class Unit
    {
        [Key]
        [StringLength(10)]
        public string UnitID { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string UnitName { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string FullName { get; set; } = string.Empty;

        [StringLength(255)]
        public string? Description { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public virtual ICollection<Grade> Grades { get; set; } = new List<Grade>();
    }
}
```

### 2. **Grade.cs** (Entity)
```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HDPrintTagAPI.Models.Entities
{
    [Table("Grades")]
    public class Grade
    {
        [Key]
        public int GradeID { get; set; }

        [Required]
        [StringLength(10)]
        public string UnitID { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string GradeCode { get; set; } = string.Empty;

        [StringLength(255)]
        public string? Description { get; set; }

        public bool IsActive { get; set; } = true;
        public bool HasSubGrade { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        [ForeignKey(nameof(UnitID))]
        public virtual Unit Unit { get; set; } = null!;
        
        public virtual ICollection<GradeNetWeight> GradeNetWeights { get; set; } = new List<GradeNetWeight>();
    }
}
```

### 3. **NetWeight.cs** (Entity)
```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HDPrintTagAPI.Models.Entities
{
    [Table("NetWeights")]
    public class NetWeight
    {
        [Key]
        public int NetWeightID { get; set; }

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal WeightValue { get; set; }

        [StringLength(10)]
        public string WeightUnit { get; set; } = "kg";

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public virtual ICollection<GradeNetWeight> GradeNetWeights { get; set; } = new List<GradeNetWeight>();
    }
}
```

### 4. **GradeNetWeight.cs** (Junction Entity)
```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HDPrintTagAPI.Models.Entities
{
    [Table("GradeNetWeights")]
    public class GradeNetWeight
    {
        [Key]
        public int ID { get; set; }

        [Required]
        public int GradeID { get; set; }

        [Required]
        public int NetWeightID { get; set; }

        public int SortOrder { get; set; } = 1;
        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        [ForeignKey(nameof(GradeID))]
        public virtual Grade Grade { get; set; } = null!;

        [ForeignKey(nameof(NetWeightID))]
        public virtual NetWeight NetWeight { get; set; } = null!;
    }
}
```

---

## 📊 DTOs (Data Transfer Objects)

### 1. **UnitDto.cs**
```csharp
namespace HDPrintTagAPI.Models.DTOs
{
    public class UnitDto
    {
        public string UnitID { get; set; } = string.Empty;
        public string UnitName { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsActive { get; set; }
    }

    public class CreateUnitDto
    {
        [Required]
        [StringLength(10)]
        public string UnitID { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string UnitName { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string FullName { get; set; } = string.Empty;

        [StringLength(255)]
        public string? Description { get; set; }
    }
}
```

### 2. **GradeDto.cs**
```csharp
namespace HDPrintTagAPI.Models.DTOs
{
    public class GradeDto
    {
        public int GradeID { get; set; }
        public string UnitID { get; set; } = string.Empty;
        public string GradeCode { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsActive { get; set; }
        public bool HasSubGrade { get; set; }
        public List<decimal> NetWeightArray { get; set; } = new List<decimal>();
    }

    public class GradeDataDto
    {
        public string Grade { get; set; } = string.Empty;
        public List<decimal> NetweightArray { get; set; } = new List<decimal>();
        public string Description { get; set; } = string.Empty;
        public bool Status { get; set; }
        public bool Sub { get; set; }
    }

    public class CreateGradeDto
    {
        [Required]
        public string UnitID { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string GradeCode { get; set; } = string.Empty;

        [StringLength(255)]
        public string? Description { get; set; }

        public bool HasSubGrade { get; set; } = false;
        
        public List<decimal> NetWeights { get; set; } = new List<decimal>();
    }
}
```

---

## 🗄️ DbContext Configuration

### **ApplicationDbContext.cs**
```csharp
using Microsoft.EntityFrameworkCore;
using HDPrintTagAPI.Models.Entities;

namespace HDPrintTagAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Unit> Units { get; set; }
        public DbSet<Grade> Grades { get; set; }
        public DbSet<NetWeight> NetWeights { get; set; }
        public DbSet<GradeNetWeight> GradeNetWeights { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Unit Configuration
            modelBuilder.Entity<Unit>(entity =>
            {
                entity.HasKey(e => e.UnitID);
                entity.HasIndex(e => new { e.UnitID, e.IsActive })
                      .HasDatabaseName("IX_Units_UnitID_IsActive");
                
                entity.Property(e => e.UnitID)
                      .HasMaxLength(10)
                      .IsUnicode(false);
            });

            // Grade Configuration
            modelBuilder.Entity<Grade>(entity =>
            {
                entity.HasKey(e => e.GradeID);
                entity.HasIndex(e => new { e.UnitID, e.GradeCode })
                      .IsUnique()
                      .HasDatabaseName("UQ_Grades_UnitID_GradeCode");
                      
                entity.HasIndex(e => new { e.UnitID, e.IsActive })
                      .HasDatabaseName("IX_Grades_UnitID_Active")
                      .IncludeProperties(e => new { e.GradeCode, e.Description });

                entity.HasOne(d => d.Unit)
                      .WithMany(p => p.Grades)
                      .HasForeignKey(d => d.UnitID)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.Property(e => e.GradeCode)
                      .HasMaxLength(20)
                      .IsUnicode(false);
            });

            // NetWeight Configuration
            modelBuilder.Entity<NetWeight>(entity =>
            {
                entity.HasKey(e => e.NetWeightID);
                entity.HasIndex(e => e.WeightValue)
                      .IsUnique()
                      .HasDatabaseName("UQ_NetWeights_WeightValue");
                      
                entity.HasIndex(e => new { e.WeightValue, e.IsActive })
                      .HasDatabaseName("IX_NetWeights_WeightValue_Active");

                entity.Property(e => e.WeightValue)
                      .HasColumnType("decimal(10,2)")
                      .HasAnnotation("CheckConstraint", "WeightValue > 0");

                entity.Property(e => e.WeightUnit)
                      .HasMaxLength(10)
                      .HasDefaultValue("kg");
            });

            // GradeNetWeight Configuration
            modelBuilder.Entity<GradeNetWeight>(entity =>
            {
                entity.HasKey(e => e.ID);
                entity.HasIndex(e => new { e.GradeID, e.NetWeightID })
                      .IsUnique()
                      .HasDatabaseName("UQ_GradeNetWeights_GradeID_NetWeightID");
                      
                entity.HasIndex(e => new { e.GradeID, e.SortOrder })
                      .HasDatabaseName("IX_GradeNetWeights_GradeID_SortOrder")
                      .IncludeProperties(e => new { e.NetWeightID, e.IsActive });

                entity.HasOne(d => d.Grade)
                      .WithMany(p => p.GradeNetWeights)
                      .HasForeignKey(d => d.GradeID)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(d => d.NetWeight)
                      .WithMany(p => p.GradeNetWeights)
                      .HasForeignKey(d => d.NetWeightID)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
```

---

## 🌱 Seed Data Configuration

### **SeedData.cs**
```csharp
using HDPrintTagAPI.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace HDPrintTagAPI.Data
{
    public static class SeedData
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            
            // Apply migrations
            context.Database.Migrate();
            
            // Seed data
            SeedUnits(context);
            SeedNetWeights(context);
            SeedGrades(context);
            SeedGradeNetWeights(context);
        }

        private static void SeedUnits(ApplicationDbContext context)
        {
            if (context.Units.Any()) return;

            var units = new[]
            {
                new Unit 
                { 
                    UnitID = "HDPE", 
                    UnitName = "HDPE", 
                    FullName = "High-Density Polyethylene", 
                    Description = "HDPE Pellet Production Unit" 
                },
                new Unit 
                { 
                    UnitID = "PP", 
                    UnitName = "PP", 
                    FullName = "Polypropylene", 
                    Description = "PP Pellet Production Unit" 
                },
                new Unit 
                { 
                    UnitID = "PPC", 
                    UnitName = "PPC", 
                    FullName = "Polypropylene Compound", 
                    Description = "PPC Pellet Production Unit" 
                }
            };

            context.Units.AddRange(units);
            context.SaveChanges();
        }

        private static void SeedNetWeights(ApplicationDbContext context)
        {
            if (context.NetWeights.Any()) return;

            // All unique weights from createSheetsAndData.js
            var weights = new decimal[] { 750, 800, 900, 16500, 18000 };

            var netWeights = weights.Select(w => new NetWeight 
            { 
                WeightValue = w, 
                WeightUnit = "kg" 
            }).ToArray();

            context.NetWeights.AddRange(netWeights);
            context.SaveChanges();
        }

        private static void SeedGrades(ApplicationDbContext context)
        {
            if (context.Grades.Any()) return;

            var grades = new List<Grade>();

            // HDPE Grades (from createSheetsAndData.js)
            var hdpeGrades = new[]
            {
                new { Code = "P901BK", Description = "Black Pipe Grade", Sub = false },
                new { Code = "P921BK", Description = "Black Pipe Grade", Sub = false },
                new { Code = "P921NT", Description = "Natural Pipe Grade", Sub = false },
                new { Code = "AM3245PC", Description = "Injection Grade", Sub = true },
                new { Code = "P900BK", Description = "Black Pipe Grade", Sub = true },
                new { Code = "P900NT", Description = "Natural Pipe Grade", Sub = false },
                new { Code = "I055BK", Description = "Injection Black", Sub = false },
                new { Code = "I055NT", Description = "Injection Natural", Sub = false },
                new { Code = "B640BK", Description = "Blow Molding Black", Sub = false }
            };

            foreach (var grade in hdpeGrades)
            {
                grades.Add(new Grade
                {
                    UnitID = "HDPE",
                    GradeCode = grade.Code,
                    Description = grade.Description,
                    HasSubGrade = grade.Sub,
                    IsActive = true
                });
            }

            // PP Grades
            var ppGrades = new[]
            {
                new { Code = "1032L", Description = "PP Standard Grade" },
                new { Code = "1100NK", Description = "PP Standard Grade" },
                new { Code = "1100PK", Description = "PP Standard Grade" },
                new { Code = "1100RC", Description = "PP Standard Grade" },
                new { Code = "1100S", Description = "PP Standard Grade" },
                new { Code = "1100XC", Description = "PP Standard Grade" },
                new { Code = "1100YC", Description = "PP Standard Grade" },
                new { Code = "1100ZC", Description = "PP Standard Grade" },
                new { Code = "1102H", Description = "PP Standard Grade" },
                new { Code = "1102K", Description = "PP Standard Grade" },
                new { Code = "1102M", Description = "PP Standard Grade" },
                new { Code = "1105RC", Description = "PP Standard Grade" },
                new { Code = "1105SC", Description = "PP Standard Grade SC" },
                new { Code = "1105TC", Description = "PP Standard Grade" },
                new { Code = "1111R", Description = "PP Standard Grade" },
                new { Code = "1120NK", Description = "PP Standard Grade" },
                new { Code = "1125NA", Description = "PP Standard Grade" },
                new { Code = "1126NK", Description = "PP Standard Grade" },
                new { Code = "1140H", Description = "PP High Flow" },
                new { Code = "1140U", Description = "PP Standard Grade" },
                new { Code = "1140VC", Description = "PP Standard Grade" },
                new { Code = "1150H", Description = "PP High Stiffness" },
                new { Code = "1202J", Description = "PP Standard Grade" },
                new { Code = "2300K", Description = "PP Standard Grade" },
                new { Code = "2300NC", Description = "PP Standard Grade" },
                new { Code = "2300NCA", Description = "PP Standard Grade" },
                new { Code = "2363LC", Description = "PP Standard Grade" },
                new { Code = "2500H", Description = "PP Standard Grade" },
                new { Code = "2500M", Description = "PP Standard Grade" },
                new { Code = "2500PC", Description = "PP Standard Grade" },
                new { Code = "3312E", Description = "PP Standard Grade" },
                new { Code = "3325M", Description = "PP Standard Grade" },
                new { Code = "3340H", Description = "PP Standard Grade" },
                new { Code = "3340HMD", Description = "PP Standard Grade" },
                new { Code = "3375RM", Description = "PP Standard Grade" },
                new { Code = "3375SM", Description = "PP Standard Grade" },
                new { Code = "3380SM", Description = "PP Standard Grade" }
            };

            foreach (var grade in ppGrades)
            {
                grades.Add(new Grade
                {
                    UnitID = "PP",
                    GradeCode = grade.Code,
                    Description = grade.Description,
                    HasSubGrade = false,
                    IsActive = true
                });
            }

            // PPC Grades
            var ppcGrades = new[]
            {
                new { Code = "B1101", Description = "PPC Block Copolymer" },
                new { Code = "BC03B", Description = "PPC Block Copolymer" },
                new { Code = "BC03BS", Description = "PPC Block Copolymer" },
                new { Code = "BC03BSW", Description = "PPC Block Copolymer" },
                new { Code = "BC04NN", Description = "PPC Block Copolymer" },
                new { Code = "BC05B", Description = "PPC Block Copolymer" },
                new { Code = "BC09CHA", Description = "PPC Block Copolymer" },
                new { Code = "BC3AWT", Description = "PPC Block Copolymer" },
                new { Code = "BC3N", Description = "PPC Block Copolymer" },
                new { Code = "BC3NSW", Description = "PPC Block Copolymer" },
                new { Code = "F1003B", Description = "PPC Block Copolymer" },
                new { Code = "FL203D", Description = "PPC Standard Grade" },
                new { Code = "K1104", Description = "PPC K Series" },
                new { Code = "K1111", Description = "PPC K Series" },
                new { Code = "K4510B", Description = "PPC K4510 Black" },
                new { Code = "K4510ET", Description = "PPC K4510 Enhanced" },
                new { Code = "K4520UB", Description = "PPC K4520 Ultra Black" },
                new { Code = "K4527B", Description = "PPC K4527 Black" },
                new { Code = "K4527ET", Description = "PPC K4527 Enhanced" },
                new { Code = "K4527GR", Description = "PPC K4527 Green" },
                new { Code = "NBC03HRA", Description = "PPC Block Copolymer" },
                new { Code = "NBC03HRAM", Description = "PPC Block Copolymer" },
                new { Code = "S1003", Description = "PPC Standard Grade" }
            };

            foreach (var grade in ppcGrades)
            {
                grades.Add(new Grade
                {
                    UnitID = "PPC",
                    GradeCode = grade.Code,
                    Description = grade.Description,
                    HasSubGrade = false,
                    IsActive = true
                });
            }

            context.Grades.AddRange(grades);
            context.SaveChanges();
        }

        private static void SeedGradeNetWeights(ApplicationDbContext context)
        {
            if (context.GradeNetWeights.Any()) return;

            // Grade NetWeight mappings from createSheetsAndData.js
            var gradeNetWeightMappings = new Dictionary<string, decimal[]>
            {
                // HDPE
                { "P901BK", new decimal[] { 750, 800, 900, 16500, 18000 } },
                { "P921BK", new decimal[] { 750, 800 } },
                { "P921NT", new decimal[] { 750 } },
                { "AM3245PC", new decimal[] { 750 } },
                { "P900BK", new decimal[] { 750 } },
                { "P900NT", new decimal[] { 750 } },
                { "I055BK", new decimal[] { 750 } },
                { "I055NT", new decimal[] { 750 } },
                { "B640BK", new decimal[] { 750 } },

                // PP
                { "1032L", new decimal[] { 750, 800, 900 } },
                { "1100NK", new decimal[] { 750, 800, 900 } },
                { "1100PK", new decimal[] { 750, 800, 900 } },
                { "1100RC", new decimal[] { 750, 800, 900 } },
                { "1100S", new decimal[] { 750, 800, 900 } },
                { "1100XC", new decimal[] { 750, 800, 900 } },
                { "1100YC", new decimal[] { 750, 800, 900 } },
                { "1100ZC", new decimal[] { 750, 800, 900 } },
                { "1102H", new decimal[] { 750, 800, 900, 16500, 18000 } },
                { "1102K", new decimal[] { 750, 800, 900 } },
                { "1102M", new decimal[] { 750, 800, 900 } },
                { "1105RC", new decimal[] { 750, 800, 900 } },
                { "1105SC", new decimal[] { 750, 800, 900, 16500, 18000 } },
                { "1105TC", new decimal[] { 750, 800, 900 } },
                { "1111R", new decimal[] { 750, 800, 900 } },
                { "1120NK", new decimal[] { 750, 800, 900 } },
                { "1125NA", new decimal[] { 750, 800, 900 } },
                { "1126NK", new decimal[] { 750, 800, 900 } },
                { "1140H", new decimal[] { 750, 800, 900 } },
                { "1140U", new decimal[] { 750, 800, 900 } },
                { "1140VC", new decimal[] { 750, 800, 900 } },
                { "1150H", new decimal[] { 750, 800, 900 } },
                { "1202J", new decimal[] { 750, 800, 900 } },
                { "2300K", new decimal[] { 750, 800, 900 } },
                { "2300NC", new decimal[] { 750, 800, 900 } },
                { "2300NCA", new decimal[] { 750, 800, 900 } },
                { "2363LC", new decimal[] { 750, 800, 900 } },
                { "2500H", new decimal[] { 750, 800, 900 } },
                { "2500M", new decimal[] { 750, 800, 900 } },
                { "2500PC", new decimal[] { 750, 800, 900 } },
                { "3312E", new decimal[] { 750, 800, 900 } },
                { "3325M", new decimal[] { 750, 800, 900 } },
                { "3340H", new decimal[] { 750, 800, 900 } },
                { "3340HMD", new decimal[] { 750, 800, 900 } },
                { "3375RM", new decimal[] { 750, 800, 900 } },
                { "3375SM", new decimal[] { 750, 800, 900 } },
                { "3380SM", new decimal[] { 750, 800, 900 } },

                // PPC
                { "B1101", new decimal[] { 750, 800, 900 } },
                { "BC03B", new decimal[] { 750, 800 } },
                { "BC03BS", new decimal[] { 750, 800 } },
                { "BC03BSW", new decimal[] { 750, 800 } },
                { "BC04NN", new decimal[] { 750, 800 } },
                { "BC05B", new decimal[] { 750, 800 } },
                { "BC09CHA", new decimal[] { 750, 800 } },
                { "BC3AWT", new decimal[] { 750, 800 } },
                { "BC3N", new decimal[] { 750, 800 } },
                { "BC3NSW", new decimal[] { 750, 800 } },
                { "F1003B", new decimal[] { 750, 800 } },
                { "FL203D", new decimal[] { 750, 800 } },
                { "K1104", new decimal[] { 750, 800 } },
                { "K1111", new decimal[] { 750, 800 } },
                { "K4510B", new decimal[] { 750, 800, 900, 16500, 18000 } },
                { "K4510ET", new decimal[] { 750, 800 } },
                { "K4520UB", new decimal[] { 750, 800 } },
                { "K4527B", new decimal[] { 750, 800 } },
                { "K4527ET", new decimal[] { 750, 800 } },
                { "K4527GR", new decimal[] { 750, 800 } },
                { "NBC03HRA", new decimal[] { 750, 800 } },
                { "NBC03HRAM", new decimal[] { 750, 800 } },
                { "S1003", new decimal[] { 750, 800 } }
            };

            var gradeNetWeights = new List<GradeNetWeight>();

            foreach (var mapping in gradeNetWeightMappings)
            {
                var gradeCode = mapping.Key;
                var weights = mapping.Value;

                // Find grade
                var grade = context.Grades.FirstOrDefault(g => g.GradeCode == gradeCode);
                if (grade == null) continue;

                // Add relationships
                for (int i = 0; i < weights.Length; i++)
                {
                    var weightValue = weights[i];
                    var netWeight = context.NetWeights.FirstOrDefault(nw => nw.WeightValue == weightValue);
                    
                    if (netWeight != null)
                    {
                        gradeNetWeights.Add(new GradeNetWeight
                        {
                            GradeID = grade.GradeID,
                            NetWeightID = netWeight.NetWeightID,
                            SortOrder = i + 1,
                            IsActive = true
                        });
                    }
                }
            }

            context.GradeNetWeights.AddRange(gradeNetWeights);
            context.SaveChanges();
        }
    }
}
```

---

## 🎮 Controllers

### **GradesController.cs**
```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HDPrintTagAPI.Data;
using HDPrintTagAPI.Models.DTOs;
using AutoMapper;

namespace HDPrintTagAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GradesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GradesController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        /// <summary>
        /// Get grade data by unit (ใช้แทน Google Sheets API)
        /// </summary>
        [HttpGet("unit/{unitId}")]
        public async Task<ActionResult<List<GradeDataDto>>> GetGradeDataByUnit(string unitId)
        {
            var grades = await _context.Grades
                .Where(g => g.UnitID == unitId && g.IsActive)
                .Include(g => g.GradeNetWeights.Where(gnw => gnw.IsActive))
                .ThenInclude(gnw => gnw.NetWeight)
                .Select(g => new GradeDataDto
                {
                    Grade = g.GradeCode,
                    Description = g.Description ?? "N/A",
                    Status = g.IsActive,
                    Sub = g.HasSubGrade,
                    NetweightArray = g.GradeNetWeights
                        .Where(gnw => gnw.IsActive && gnw.NetWeight.IsActive)
                        .OrderBy(gnw => gnw.SortOrder)
                        .Select(gnw => gnw.NetWeight.WeightValue)
                        .ToList()
                })
                .ToListAsync();

            return Ok(grades);
        }

        /// <summary>
        /// Add netweight to grade
        /// </summary>
        [HttpPost("{gradeId}/netweights")]
        public async Task<IActionResult> AddNetWeightToGrade(int gradeId, [FromBody] AddNetWeightRequest request)
        {
            var grade = await _context.Grades.FindAsync(gradeId);
            if (grade == null)
                return NotFound("Grade not found");

            // Get or create NetWeight
            var netWeight = await _context.NetWeights
                .FirstOrDefaultAsync(nw => nw.WeightValue == request.WeightValue);

            if (netWeight == null)
            {
                netWeight = new NetWeight { WeightValue = request.WeightValue };
                _context.NetWeights.Add(netWeight);
                await _context.SaveChangesAsync();
            }

            // Check if relationship already exists
            var existingRelation = await _context.GradeNetWeights
                .FirstOrDefaultAsync(gnw => gnw.GradeID == gradeId && gnw.NetWeightID == netWeight.NetWeightID);

            if (existingRelation != null)
                return BadRequest("NetWeight already exists for this grade");

            // Add relationship
            var maxSortOrder = await _context.GradeNetWeights
                .Where(gnw => gnw.GradeID == gradeId)
                .MaxAsync(gnw => (int?)gnw.SortOrder) ?? 0;

            var gradeNetWeight = new GradeNetWeight
            {
                GradeID = gradeId,
                NetWeightID = netWeight.NetWeightID,
                SortOrder = request.SortOrder ?? maxSortOrder + 1,
                IsActive = true
            };

            _context.GradeNetWeights.Add(gradeNetWeight);
            await _context.SaveChangesAsync();

            return Ok(new { message = "NetWeight added successfully" });
        }

        /// <summary>
        /// Remove netweight from grade
        /// </summary>
        [HttpDelete("{gradeId}/netweights/{netWeightId}")]
        public async Task<IActionResult> RemoveNetWeightFromGrade(int gradeId, int netWeightId)
        {
            var gradeNetWeight = await _context.GradeNetWeights
                .FirstOrDefaultAsync(gnw => gnw.GradeID == gradeId && gnw.NetWeightID == netWeightId);

            if (gradeNetWeight == null)
                return NotFound("Relationship not found");

            gradeNetWeight.IsActive = false;
            await _context.SaveChangesAsync();

            return Ok(new { message = "NetWeight removed successfully" });
        }
    }

    public class AddNetWeightRequest
    {
        public decimal WeightValue { get; set; }
        public int? SortOrder { get; set; }
    }
}
```

---

## ⚙️ Configuration Files

### **appsettings.json**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=HDPrintTagDB;Trusted_Connection=true;TrustServerCertificate=true;",
    "SqlServerConnection": "Server=your-server;Database=HDPrintTagDB;User Id=your-username;Password=your-password;TrustServerCertificate=true;"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore": "Information"
    }
  },
  "AllowedHosts": "*",
  "ApiSettings": {
    "EnableSwagger": true,
    "CorsOrigins": [
      "http://localhost:3000",
      "https://your-frontend-domain.com"
    ]
  }
}
```

### **appsettings.Development.json**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=HDPrintTagDB_Dev;Trusted_Connection=true;TrustServerCertificate=true;"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Debug",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore": "Information"
    }
  }
}
```

---

## 🚀 Program.cs (Main Configuration)

```csharp
using Microsoft.EntityFrameworkCore;
using HDPrintTagAPI.Data;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

// Database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// AutoMapper
builder.Services.AddAutoMapper(typeof(Program));

// Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { 
        Title = "HD Print Tag API", 
        Version = "v1",
        Description = "API for HD Print Tag System - Grade and NetWeight Management"
    });
    
    // Include XML comments
    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
    {
        c.IncludeXmlComments(xmlPath);
    }
});

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        var corsOrigins = builder.Configuration.GetSection("ApiSettings:CorsOrigins").Get<string[]>() ?? new string[0];
        policy.WithOrigins(corsOrigins)
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Health Checks
builder.Services.AddHealthChecks()
    .AddDbContextCheck<ApplicationDbContext>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "HD Print Tag API v1");
        c.RoutePrefix = ""; // Swagger at root
    });
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

app.MapHealthChecks("/health");

// Initialize database with seed data
using (var scope = app.Services.CreateScope())
{
    try
    {
        SeedData.Initialize(scope.ServiceProvider);
        app.Logger.LogInformation("Database seeded successfully");
    }
    catch (Exception ex)
    {
        app.Logger.LogError(ex, "An error occurred while seeding the database");
    }
}

app.Run();
```

---

## 📦 Package Dependencies

### **HDPrintTagAPI.csproj**
```xml
<Project Sdk="Microsoft.NET.Sdk.Web">

  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
    <GenerateDocumentationFile>true</GenerateDocumentationFile>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="8.0.0" />
    <PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="8.0.0" />
    <PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="8.0.0" />
    <PackageReference Include="AutoMapper" Version="12.0.1" />
    <PackageReference Include="AutoMapper.Extensions.Microsoft.DependencyInjection" Version="12.0.1" />
    <PackageReference Include="Swashbuckle.AspNetCore" Version="6.4.0" />
    <PackageReference Include="Microsoft.AspNetCore.HealthChecks.EntityFrameworkCore" Version="8.0.0" />
    <PackageReference Include="Serilog.AspNetCore" Version="8.0.0" />
  </ItemGroup>

</Project>
```

---

## 🛠️ Migration Commands

```bash
# Install EF Core CLI tools
dotnet tool install --global dotnet-ef

# Create initial migration
dotnet ef migrations add InitialCreate

# Update database
dotnet ef database update

# Add new migration (when model changes)
dotnet ef migrations add AddNewFeature

# Remove last migration (if not applied)
dotnet ef migrations remove

# Generate SQL scripts
dotnet ef migrations script

# Update to specific migration
dotnet ef database update SpecificMigrationName
```

---

## 📊 API Usage Examples

### **Frontend Integration (JavaScript)**
```javascript
// Replace Google Sheets API calls
const API_BASE_URL = 'https://your-api-domain.com/api';

// Get grade data by unit
async function getGradeDataByUnit(unitId) {
    const response = await fetch(`${API_BASE_URL}/grades/unit/${unitId}`);
    return await response.json();
}

// Usage in existing code
const hdpeGrades = await getGradeDataByUnit('HDPE');
console.log(hdpeGrades); // Same format as Google Sheets API

// Add netweight to grade
async function addNetWeight(gradeId, weightValue) {
    const response = await fetch(`${API_BASE_URL}/grades/${gradeId}/netweights`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ WeightValue: weightValue })
    });
    return await response.json();
}
```

---

## 🔧 AutoMapper Profile

### **AutoMapperProfile.cs**
```csharp
using AutoMapper;
using HDPrintTagAPI.Models.Entities;
using HDPrintTagAPI.Models.DTOs;

namespace HDPrintTagAPI.Configuration
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<Unit, UnitDto>();
            CreateMap<CreateUnitDto, Unit>();
            
            CreateMap<Grade, GradeDto>()
                .ForMember(dest => dest.NetWeightArray, opt => opt.MapFrom(src => 
                    src.GradeNetWeights
                        .Where(gnw => gnw.IsActive && gnw.NetWeight.IsActive)
                        .OrderBy(gnw => gnw.SortOrder)
                        .Select(gnw => gnw.NetWeight.WeightValue)
                        .ToList()));
                        
            CreateMap<CreateGradeDto, Grade>();
        }
    }
}
```

---

## 📈 Performance Tips

### 1. **Query Optimization**
```csharp
// Use projection to avoid loading unnecessary data
var gradeData = await _context.Grades
    .Where(g => g.UnitID == unitId && g.IsActive)
    .Select(g => new GradeDataDto
    {
        Grade = g.GradeCode,
        Description = g.Description ?? "N/A",
        Status = g.IsActive,
        Sub = g.HasSubGrade,
        NetweightArray = g.GradeNetWeights
            .Where(gnw => gnw.IsActive)
            .OrderBy(gnw => gnw.SortOrder)
            .Select(gnw => gnw.NetWeight.WeightValue)
            .ToList()
    })
    .ToListAsync();
```

### 2. **Caching Strategy**
```csharp
// Add Memory Cache
builder.Services.AddMemoryCache();

// In Controller
private readonly IMemoryCache _cache;

public async Task<ActionResult<List<GradeDataDto>>> GetGradeDataByUnit(string unitId)
{
    var cacheKey = $"grades_{unitId}";
    
    if (!_cache.TryGetValue(cacheKey, out List<GradeDataDto>? grades))
    {
        grades = await GetGradesFromDatabase(unitId);
        _cache.Set(cacheKey, grades, TimeSpan.FromMinutes(30));
    }
    
    return Ok(grades);
}
```

---

## 🚀 Deployment Guide

### 1. **Docker Support**
```dockerfile
# Dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["HDPrintTagAPI.csproj", "."]
RUN dotnet restore "./HDPrintTagAPI.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "HDPrintTagAPI.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "HDPrintTagAPI.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "HDPrintTagAPI.dll"]
```

### 2. **Environment Variables**
```bash
# Production Environment Variables
ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__DefaultConnection="Server=prod-server;Database=HDPrintTagDB;User Id=api_user;Password=secure_password;"
ApiSettings__CorsOrigins__0=https://your-production-domain.com
```

---

**Created:** 2025-12-11  
**Author:** HD Print Tag System  
**Version:** 1.0.0  
**Framework:** .NET 8.0 + Entity Framework Core