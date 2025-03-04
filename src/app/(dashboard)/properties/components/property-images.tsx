import { Property, PropertyImage } from "@/types";
import request from "@/utils/request";
import { useQuery } from "@tanstack/react-query";

export default function PropertyImage({ property }: { property: Property }) {
  const { data } = useQuery({
    queryKey: ['property-images', property.id],
    queryFn: async () => {
      const res = await request({
        url: `/properties/${property.id}/images`,
      });

      if (res?.status === 200) {
        return res.data;
      }
      throw Error(res?.data?.message);
    },
    enabled: Boolean(property.id),
  });

  const items: PropertyImage[] = data?.images || [];

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

        {
          items.map(item => (
            <div key={item.fileId}>
              <img className="h-auto max-w-full" src={item.fileUrl} alt="" />
            </div>
          ))
        }
      </div>
    </div>
  );
}