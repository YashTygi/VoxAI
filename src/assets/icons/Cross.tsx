import React from 'react'

const Cross = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg {...props} viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_107_243)">
<path d="M56.2971 56.2971L65 65M65 65L73.703 73.703M65 65L73.703 56.2971M65 65L56.2972 73.7027M97 65C97 82.6732 82.6732 97 65 97C47.3269 97 33 82.6732 33 65C33 47.3269 47.3269 33 65 33C82.6732 33 97 47.3269 97 65Z" stroke="#8486F3" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" shape-rendering="crispEdges"/>
</g>
<defs>
<filter id="filter0_d_107_243" x="0.5" y="0.5" width="129" height="129" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset/>
<feGaussianBlur stdDeviation="15"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.741176 0 0 0 0 0.74902 0 0 0 0 0.992157 0 0 0 1 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_107_243"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_107_243" result="shape"/>
</filter>
</defs>
</svg>

  )
}

export default Cross