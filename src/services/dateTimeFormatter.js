
export default function formatDate(isoDate) {
    const dateObj = new Date(isoDate);
  
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = dateObj.getFullYear();
  
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  
    // return {
    //   date: `${day}/${month}/${year}`,
    //   time: `${hours}:${minutes}`
    // };
  }
  