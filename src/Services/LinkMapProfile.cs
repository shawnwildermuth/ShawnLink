using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;

namespace ShawnLink.Services
{
  public class LinkMapProfile : Profile
  {
    public LinkMapProfile()
    {
      CreateMap<LinkEntity, LinkModel>()
        .ForMember(l => l.Key, opt => opt.MapFrom(l => l.RowKey))
        .ForMember(l => l.Url, opt => opt.MapFrom(l => l.Link));
    }
  }
}
