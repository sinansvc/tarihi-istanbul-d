import { useAuth } from './useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Hook to get business data with appropriate privacy filtering
export const useSecureBusinessData = (businessId?: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['secure-business', businessId, user?.id],
    queryFn: async () => {
      if (!businessId) return null;

      const { data: business, error } = await supabase
        .from('businesses')
        .select(`
          *,
          categories(name_tr, name_en, icon, color),
          locations(name_tr, name_en),
          business_images(*)
        `)
        .eq('id', businessId)
        .single();

      if (error) throw error;

      // Check if user is admin
      const { data: userRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user?.id)
        .eq('role', 'admin')
        .maybeSingle();

      const isAdmin = !!userRole;

      // Check if user owns this business
      const { data: profile } = await supabase
        .from('profiles')
        .select('business_id')
        .eq('id', user?.id)
        .eq('business_id', businessId)
        .maybeSingle();

      const isOwner = !!profile;

      // If user is not admin or owner, filter out sensitive contact information
      if (!isAdmin && !isOwner && user) {
        return {
          ...business,
          phone: null,
          email: null,
          whatsapp: null,
          shop_number: null,
          owner_name: null,
          website: null
        };
      }

      return business;
    },
    enabled: !!businessId
  });
};

// Hook to filter contact information from business lists
export const useFilteredBusinessList = (businesses: any[]) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-role-check', user?.id],
    queryFn: async () => {
      if (!user) return businesses;

      // Check if user is admin
      const { data: userRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      const isAdmin = !!userRole;

      if (isAdmin) {
        return businesses; // Admin can see all contact info
      }

      // Get user's business ID
      const { data: profile } = await supabase
        .from('profiles')
        .select('business_id')
        .eq('id', user.id)
        .maybeSingle();

      const userBusinessId = profile?.business_id;

      // Filter out contact information for businesses not owned by the user
      return businesses.map((business: any) => {
        if (business.id === userBusinessId) {
          return business; // User can see their own business contact info
        }

        return {
          ...business,
          phone: null,
          email: null,
          whatsapp: null,
          shop_number: null,
          owner_name: null,
          website: null
        };
      });
    },
    enabled: !!user && businesses.length > 0
  });
};