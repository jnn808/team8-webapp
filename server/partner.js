export const versions = {
  v1: {
    path: '/api/handymen',  // Must have /api here!
    parse: (body) => {
      return body.map(t => ({
        id: t.id,
        name: t.name,
        serviceCategory: t.serviceCategory || t.service,
        location: t.location,
        phone: t.phone
      }));
    }
  },
  v2: {
    path: '/api/v2/handymen',
    parse: (body) => {
      const list = Array.isArray(body) ? body : body?.data;
      return list.map(t => ({
        id: t.id,
        name: t.name,
        serviceCategory: t.service || t.serviceCategory,
        location: t.location,
        phone: t.phone
      }));
    }
  }
};