function generatePassword(fatherName, motherName) {
  const fClean = (fatherName || '').replace(/\s+/g, '').toUpperCase();
  const mClean = (motherName || '').replace(/\s+/g, '').toUpperCase();
  return `${fClean.substring(0, 4)}@${mClean.substring(0, 4)}`;
}

console.log('Test 1:', generatePassword('RAKESH KUMAR', 'KARUNA KUMARI')); // RAKE@KARU
console.log('Test 2:', generatePassword('OM PRAKASH', 'SAVI DEVI')); // OMPR@SAVI
console.log('Test 3:', generatePassword('INDRA RAJ SINGH', 'NAV DEVI')); // INDR@NAVD
