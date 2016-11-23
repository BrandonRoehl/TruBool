class User < ApplicationRecord
    def self.from_oauth(info)
        u = self.find_or_create_by(id: info['id'])
        info.slice(
            'email',
            'given_name',
            'family_name',
            'link',
            'picture'
        ).each do |k,v|
            u.send "#{k}=", v
        end
        u.save
        return u
    end

    def name
        if self.given_name.blank?
            return self.family_name
        elsif self.family_name.blank?
            return self.given_name
        else
            return "#{self.given_name} #{self.family_name}"
        end
    end

    def picture_scale(size = 512)
        return self.picture.gsub(/\/photo\.jpg$/, "/s#{size.to_s}-c-mo/photo.jpg")
    end
end
