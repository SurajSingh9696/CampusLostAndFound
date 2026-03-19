export const CATEGORIES = [
  { value: 'ID Card', label: 'ID Card', icon: 'ID' },
  { value: 'Electronics', label: 'Electronics', icon: 'ELEC' },
  { value: 'Books', label: 'Books', icon: 'BOOK' },
  { value: 'Clothing', label: 'Clothing', icon: 'CLTH' },
  { value: 'Keys', label: 'Keys', icon: 'KEY' },
  { value: 'Wallet', label: 'Wallet', icon: 'WLET' },
  { value: 'Bag', label: 'Bag', icon: 'BAG' },
  { value: 'Jewelry', label: 'Jewelry', icon: 'JWEL' },
  { value: 'Others', label: 'Others', icon: 'OTHR' },
];

export const STATUSES = [
  { value: 'Open', label: 'Open', color: 'bg-secondary-500' },
  { value: 'Claimed', label: 'Claimed', color: 'bg-primary-500' },
  { value: 'Returned', label: 'Returned', color: 'bg-accent-500' },
  { value: 'Closed', label: 'Closed', color: 'bg-neutral-400' },
];

export const PRIORITIES = [
  { value: 'Low', label: 'Low', color: 'bg-neutral-400' },
  { value: 'Medium', label: 'Medium', color: 'bg-secondary-500' },
  { value: 'High', label: 'High', color: 'bg-primary-500' },
  { value: 'Urgent', label: 'Urgent', color: 'bg-red-600' },
];

export const ITEM_TYPES = [
  { value: 'Lost', label: 'Lost', icon: 'LOST' },
  { value: 'Found', label: 'Found', icon: 'FOUND' },
];

export const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'createdAt', label: 'Oldest First' },
  { value: '-views', label: 'Most Viewed' },
  { value: 'title', label: 'Title (A-Z)' },
  { value: '-title', label: 'Title (Z-A)' },
];

export const BUILDINGS = [
  'Main Building',
  'Science Block',
  'Engineering Block',
  'Library',
  'Sports Complex',
  'Hostel A',
  'Hostel B',
  'Cafeteria',
  'Auditorium',
  'Parking Area',
];
