export function formatDate(date) {
  const d = new Date(date);
  const now = new Date();
  const diff = now - d;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) {
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  } else if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
}

export function formatTime(time) {
  if (!time) return '';
  
  // If time is in HH:MM format, convert to 12-hour format
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

export function getStatusColor(status) {
  const colors = {
    Open: 'bg-secondary-500 text-white',
    Claimed: 'bg-primary-500 text-white',
    Returned: 'bg-accent-500 text-white',
    Closed: 'bg-neutral-400 text-white',
  };
  return colors[status] || 'bg-neutral-400 text-white';
}

export function getPriorityColor(priority) {
  const colors = {
    Low: 'bg-neutral-400 text-white',
    Medium: 'bg-secondary-500 text-white',
    High: 'bg-primary-500 text-white',
    Urgent: 'bg-red-600 text-white',
  };
  return colors[priority] || 'bg-neutral-400 text-white';
}

export function getCategoryIcon(category) {
  const icons = {
    'ID Card': 'ID',
    Electronics: 'ELEC',
    Books: 'BOOK',
    Clothing: 'CLTH',
    Keys: 'KEY',
    Wallet: 'WLET',
    Bag: 'BAG',
    Jewelry: 'JWEL',
    Others: 'OTHR',
  };
  return icons[category] || 'OTHR';
}

export function truncateText(text, maxLength = 100) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePhone(phone) {
  const re = /^[\d\s\-\+\(\)]+$/;
  return phone.length >= 10 && re.test(phone);
}

export function compressImage(file, maxSizeMB = 1) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDimension = 1200;
        
        if (width > height && width > maxDimension) {
          height = (height / width) * maxDimension;
          width = maxDimension;
        } else if (height > maxDimension) {
          width = (width / height) * maxDimension;
          height = maxDimension;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Try different quality levels to get under maxSizeMB
        let quality = 0.8;
        const checkSize = () => {
          canvas.toBlob((blob) => {
            const sizeMB = blob.size / 1024 / 1024;
            
            if (sizeMB <= maxSizeMB || quality < 0.1) {
              const reader = new FileReader();
              reader.onloadend = () => {
                resolve(reader.result);
              };
              reader.readAsDataURL(blob);
            } else {
              quality -= 0.1;
              checkSize();
            }
          }, 'image/jpeg', quality);
        };
        
        checkSize();
      };
      img.src = e.target.result;
    };
    
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
