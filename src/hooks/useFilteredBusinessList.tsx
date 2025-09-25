import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useFilteredBusinessList = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['businesses', user?.id],
    queryFn: async () => {
      // Get all active businesses
      const { data: businesses, error } = await supabase
        .from('businesses')
        .select(`
          id,
          name_tr,
          name_en,
          description_tr,
          description_en,
          logo_url,
          cover_image_url,
          established_year,
          business_type,
          accepts_online_orders,
          delivery_available,
          payment_methods,
          working_hours,
          created_at,
          updated_at,
          categories(name_tr, name_en, icon, color),
          locations(name_tr, name_en)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Filter contact information based on user permissions
      if (!businesses) return [];

      // Check if user is admin
      let isAdmin = false;
      if (user) {
        const { data: userRoles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .single();
        
        isAdmin = !!userRoles;
      }

      // Check user's business ownership
      let userBusinessId = null;
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('business_id')
          .eq('id', user.id)
          .single();
        
        userBusinessId = profile?.business_id;
      }

      // Filter businesses - show only public info unless user is admin or business owner
      return businesses.map(business => {
        const canViewContactInfo = isAdmin || (userBusinessId === business.id);
        
        if (canViewContactInfo) {
          return business; // Admin or business owner can see all info
        }

        // Regular users get filtered version without contact details
        return {
          ...business,
          // Remove sensitive contact information for public view
          phone: undefined,
          email: undefined,
          whatsapp: undefined,
          website: undefined,
          address: undefined,
          shop_number: undefined,
          social_media: undefined
        };
      });
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};