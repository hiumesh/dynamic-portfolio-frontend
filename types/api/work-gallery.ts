interface TechProject {
  id: number;
  order_index: number;
  title: string;
  description: string;
  tech_used: string[];
  publisher_id: string;
  publisher_avatar: string;
  publisher_name: string;
  // attributes: null | {
  //   links: {
  //     platform: string;
  //     label: string;
  //     url: string;
  //   }[];
  // };
  links: {
    platform: string;
    label: string;
    url: string;
  }[];
  attachments: {
    id: number;
    file_name: string;
    file_url: string;
    file_type: string;
    file_size: number;
  }[];
}

type WorkGalleryItem = TechProject;

type WorkGalleryItems = WorkGalleryItem[];
