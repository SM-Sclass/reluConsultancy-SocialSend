export const FILTER_TYPES = {
    DROPDOWN: 'dropdown',
    NUMERIC: 'numeric',
    TAG: 'tag',
    TEXT: 'text'
  };
  
  export const FILTER_OPTIONS = {
    SOCIAL_PLATFORMS: ['Instagram', 'Twitter', 'TikTok', 'LinkedIn', 'Facebook', 'YouTube'],
    GENDERS: ['Male', 'Female', 'Non-Binary', 'Other']
  };
  
  export const FILTERS_CONFIG = [
    {
      id: 'social_platform',
      title: 'Social Platform',
      type: FILTER_TYPES.DROPDOWN,
      options: FILTER_OPTIONS.SOCIAL_PLATFORMS
    },
    {
      id: 'filter_name',
      title: 'Filter Name',
      type: FILTER_TYPES.TEXT,
      placeholder: 'Enter name to filter'
    },
    {
      id: 'hashtag',
      title: 'Hashtags',
      type: FILTER_TYPES.TAG
    },
    {
      id: 'gender',
      title: 'Gender',
      type: FILTER_TYPES.DROPDOWN,
      options: FILTER_OPTIONS.GENDERS
    },
    {
      id: 'age',
      title: 'Age',
      type: FILTER_TYPES.NUMERIC,
      placeholder: 'Enter age'
    },
    {
      id: 'followers',
      title: 'Followers',
      type: FILTER_TYPES.NUMERIC,
      placeholder: 'Enter followers count'
    },
    {
      id: 'keywords',
      title: 'Keywords in Bio',
      type: FILTER_TYPES.TAG
    },
    {
      id: 'following_lists',
      title: 'Following a Certain Profile',
      type: FILTER_TYPES.TAG
    },
    {
      id: 'interests',
      title: 'Interests',
      type: FILTER_TYPES.TAG
    },
    {
      id: 'location',
      title: 'Locations',
      type: FILTER_TYPES.TAG
    }
  ];