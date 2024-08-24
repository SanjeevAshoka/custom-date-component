export const handleSocialIcons = (iconName: string)=>{
    switch(iconName){
        case 'linkedin': window.open('https://www.linkedin.com/in/doer-sanjeev-ashoka/', '_blank'); break;
        case 'github': window.open('https://github.com/sanjeevAshoka', '_blank'); break;
        default : break;
    }
}

export const projectRepoIcons = (projectName: string)=>{
    window.open(`https://github.com/SanjeevAshoka/${projectName}`, '_blank');
}

export const projectWebsiteLinks = (projectName: string)=>{
    window.open(projectName, '_blank');

    // switch(projectName){
    //     case 'responsive': window.open(`https://sanjeevashoka.github.io/Responsive_Landing_Page/`, '_blank'); break;
    //     case 'movix': window.open(`https://moviex-nine-mocha.vercel.app/`, '_blank'); break;
    //     case 'fitClub': window.open(`https://fitclubgym-6jk.pages.dev/`, '_blank'); break;
    //     default : break;
    //   }
}
export const companyLinkHandler = (companyName: string) => {
    switch (companyName) {
        case 'hexagon': window.open(`https://www.linkedin.com/company/hexagon-capability-center-india/about/`, '_blank'); break;
        case 'lowes': window.open(`https://www.linkedin.com/company/lowe-s-india/mycompany/about/`, '_blank'); break;
        default: break;
    }
}

export const formFieldChecker = (userData: { userEmail: string, subject: string, message: string }): any => {
    const checksResponse: any = {};
    if (userData.userEmail) {
        const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if (regex.test(userData.userEmail)) { checksResponse['userEmail'] = true; }
        else { checksResponse['userEmail'] = "Please enter valid gmail!"; }
    } else {
        checksResponse['userEmail'] = "Please enter your gmail!";
    }
    if (userData.subject) { checksResponse['subject'] = true; }
    else { checksResponse['subject'] = "Please enter suject!"; }
    if (userData.message) { checksResponse['message'] = true; }
    else { checksResponse['message'] = "Please enter your message!"; }

    const flag = checksResponse.userEmail == true && checksResponse.subject ==true && checksResponse.message == true ? true: false;
    return { checksResponse, flag };
}