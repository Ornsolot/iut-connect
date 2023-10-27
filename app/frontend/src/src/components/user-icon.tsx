import React from 'react'

export default function UserIcon({ user, size='2rem', className }: { user: any, size?: string, className?: string }) {
  function isDarkColor(hexColor: string) {
    hexColor = hexColor.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => {return "#" + r + r + g + g + b + b});
    const hex = hexColor.replace(/^#/, '');
    const red = parseInt(hex.substring(0, 2), 16);
    const green = parseInt(hex.substring(2, 4), 16);
    const blue = parseInt(hex.substring(4, 6), 16);
    const brightness = (red * 299 + green * 587 + blue * 114) / 1000;
    return brightness < 128;
  }

  function getStyle () {
    function convertStringToNumber (str: string) {
      let num = 0
      for (let i = 0; i < str.length; i++) num += str.charCodeAt(i)
      return num
    }

    if (user.mail) {
      const numericEmailNameValue = convertStringToNumber(user.id + user.mail.split('@')[0])
      const numericEmailDomainValue = convertStringToNumber(user.id + user.mail.split('@')[1])
      const numericEmailValue = convertStringToNumber(user.id + user.mail)
      const str = (numericEmailValue).toString(16).slice(0, 3)
      const str2 = (user.id + str.slice(1)).slice(0, 3)
  
      return {
        background: `radial-gradient(${(numericEmailValue % 100) + 25}% ${((numericEmailValue + numericEmailDomainValue) % 100) + 25}% at ${numericEmailValue % 80}% ${(numericEmailValue + numericEmailNameValue) % 80}%, #${str} 0%, #${str2} 100%`,
        backgroundSize: '300%',
        color: isDarkColor('#'+str2) ? 'white' : 'black'
      }
    }
  }

  if (user.photo) {
    return <img  className={`m-1 rounded-md`} src={user.photo} alt='user icon' style={{ width: size, height: size }}></img>
  } else {
    return (
      <div className={`flex m-1 rounded-md items-center justify-center font-black ${className}`} style={{...getStyle(), width: size, height: size}}>
        { user.name ? user.name.slice(0, 1) : '?' }
      </div>
    )
  }
}
