class User < ApplicationRecord
    def self.from_oauth(info)
        u = self.find_or_create_by(id: info['id'])
        # info.permit(
            # :email,
            # :given_name,
            # :family_name,
            # :link,
            # :picture
        # ).each do |k,v|
            # u.send k, v
        # end
        # raise u.inspect
        # u.save
        return u
    end
end
