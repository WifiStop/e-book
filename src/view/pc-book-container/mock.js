import {generate} from 'shortid'
 const mockData = 
  {
    pageCount:26,
    data:[
      {
        type:'cover',
        svgName:'0001.svg',
        hoverData:[],
        key:generate()
      },
      {
          type:'content',
          svgName:'0360.svg',
          hoverData:[],
          direction:'left',
          key:generate()
        },
          {
          type:'content',
          svgName:'0361.svg',
          hoverData:[],
          direction:'right',
          key:generate()
        },
          {
          type:'content',
          svgName:'0362.svg',
          hoverData:[],
          direction:'left',
          key:generate()
        },
          {
          type:'content',
          svgName:'0363.svg',
          hoverData:[],
          direction:'right',
          key:generate()
        },
        {
          type:'backCover',
           svgName:'0364.svg',
           hoverData:[],

           key:generate()
        }
    ]
  }
  const mockJpgData = 
    {
      pageCount:26,
      data:[]
    }
  
  mockData.data= []
  for(let i=1;i<=26;i++){
    let obj = {
      key:generate(),
      svgName:'test-'+i+'.svg'
      // svgName:'test_'+i+'_thumb.jpg'
    }
    mockData.data.push(obj)
  }
  for(let i=1;i<=26;i++){
    let obj = {
      key:generate(),
      svgName:'test-'+i+'.jpg'
      // svgName:'test_'+i+'_thumb.jpg'
    }
    mockJpgData.data.push(obj)
  }
  export {mockData,mockJpgData}
  
