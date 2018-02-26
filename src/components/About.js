import React, { Component } from 'react';
import { Dialog, RaisedButton, Divider } from 'material-ui';
import '../styles/About.css';

class About extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleOpen() {
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({ open: false });
  }


  render() {
    return (
      <div className="about">
        <div className="aboutLegal">
          <div>By using this application, you automatically agree to the following, in addition to all applicable laws and regulations</div>
          <div>1-The Terms and Conditions listed in the Spotify Developer Terms of Use, located
            <a href="https://developer.spotify.com/developer-terms-of-use/">Here</a>
          </div>
          <div>2-The Terms and Conditions of Playlist Calcify</div>
          <div>3-The Privacy Policy of Playlist Calcify</div>
          <div className="aboutEULAButton">
            <RaisedButton label="EULA and Privacy Policy" onClick={this.handleOpen} />
          </div>
          <Dialog
            title="End User License Agreement and Privacy Policy"
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleClose}
            autoScrollBodyContent
          >
            <div>
              <h2>End-User License Agreement (EULA) of <span className="app_name">Playlist Calcify</span></h2>
              <p>This End-User License Agreement ("EULA") is a legal agreement between you and <span className="company_name">AGR</span></p>
              <p>This EULA agreement governs your acquisition and use of our <span className="app_name">Playlist Calcify</span> software ("Software") directly from <span className="company_name">AGR</span> or indirectly through a <span className="company_name">AGR</span> authorized reseller or distributor (a "Reseller").</p>
              <p>Please read this EULA agreement carefully before completing the installation process and using the <span className="app_name">Playlist Calcify</span> software. It provides a license to use the <span className="app_name">Playlist Calcify</span> software and contains warranty information and liability disclaimers.</p>
              <p>If you register for a free trial of the <span className="app_name">Playlist Calcify</span> software, this EULA agreement will also govern that trial. By clicking "accept" or installing and/or using the <span className="app_name">Playlist Calcify</span> software, you are confirming your acceptance of the Software and agreeing to become bound by the terms of this EULA agreement.</p>
              <p>If you are entering into this EULA agreement on behalf of a company or other legal entity, you represent that you have the authority to bind such entity and its affiliates to these terms and conditions. If you do not have such authority or if you do not agree with the terms and conditions of this EULA agreement, do not install or use the Software, and you must not accept this EULA agreement.</p>
              <p>This EULA agreement shall apply only to the Software supplied by <span className="company_name">AGR</span> herewith regardless of whether other software is referred to or described herein. The terms also apply to any <span className="company_name">AGR</span> updates, supplements, Internet-based services, and support services for the Software, unless other terms accompany those items on delivery. If so, those terms apply.</p>
              <h3>License Grant</h3>
              <p><span className="company_name">AGR</span> hereby grants you a personal, non-transferable, non-exclusive licence to use the <span className="app_name">Playlist Calcify</span> software on your devices in accordance with the terms of this EULA agreement.</p>
              <p>You are permitted to load the <span className="app_name">Playlist Calcify</span> software (for example a PC, laptop, mobile or tablet) under your control. You are responsible for ensuring your device meets the minimum requirements of the <span className="app_name">Playlist Calcify</span> software.</p>
              <p>You must comply with all</p>
              <p>You are not permitted to:</p>
              <ul>
                <li>Edit, alter, modify, adapt, translate or otherwise change the whole or any part of the Software nor permit the whole or any part of the Software to be combined with or become incorporated in any other software, nor decompile, disassemble or reverse engineer the Software or attempt to do any such things</li>
                <li>Reproduce, copy, distribute, resell or otherwise use the Software for any commercial purpose</li>
                <li>Allow any third party to use the Software on behalf of or for the benefit of any third party</li>
                <li>Use the Software in any way which breaches any applicable local, national or international law</li>
                <li>Use the Software for any purpose that <span className="company_name">AGR</span> considers is a breach of this EULA agreement</li>
                <li>Make any warranties or representations on behalf of Spotify and expressly disclaim all implied warranties with respect to the Spotify Platform, Spotify Service and Spotify Content, including the implied warranties of merchantability, fitness for a particular purpose and non-infringement</li>
                <li>Modify or creating derivative works based on the Spotify Platform, Spotify Service or Spotify Content</li>
                <li>Perform any sort of decompiling, reverse-engineering, disassembling, and otherwise reducing the Spotify Platform, Spotify Service, and Spotify Content to source code or other human-perceivable form, to the full extent allowed by law</li>
                <li />
              </ul>
              <h3>Intellectual Property and Ownership</h3>
              <p><span className="company_name">AGR</span> shall at all times retain ownership of the Software as originally downloaded by you and all subsequent downloads of the Software by you. The Software (and the copyright, and other intellectual property rights of whatever nature in the Software, including any modifications made thereto) are and shall remain the property of <span className="company_name">AGR</span>.</p>
              <p><span className="company_name">AGR</span> reserves the right to grant licences to use the Software to third parties.</p>
              <p><span className="company_name">AGR</span> is responsible for this product and disclaim any liability on the part of third parties (e.g., Spotify)</p>
              <p><span className="company_name">AGR</span> states that Spotify is a third party beneficiary of this end user license agreement and privacy policy and is entitled to directly enforce your end user license agreement.</p>
              <h3>Termination</h3>
              <p>This EULA agreement is effective from the date you first use the Software and shall continue until terminated. You may terminate it at any time upon written notice to <span className="company_name">AGR</span>.</p>
              <p>This EULA was created by <a href="http://eulatemplate.com">eulatemplate.com</a> for <span className="app_name">Playlist Calcify</span></p>
              <p>It will also terminate immediately if you fail to comply with any term of this EULA agreement. Upon such termination, the licenses granted by this EULA agreement will immediately terminate and you agree to stop all access and use of the Software. The provisions that by their nature continue and survive will survive any termination of this EULA agreement.</p>
              <h3>Governing Law</h3>
              <p>This EULA agreement, and any dispute arising out of or in connection with this EULA agreement, shall be governed by and construed in accordance with the laws of <span className="country">[COUNTRY]</span>.</p>
              <h2>Privacy Policy for Playlist calcify</h2>
              <p>At playlistcalcify.tk, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by playlistcalcify.tk and how we use it.</p>
              <p>If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us through email at playlistcalcify@mailinator.com.</p>
              <p><strong>Log Files</strong></p>
              <p>playlistcalcify.tk follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services’ analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users’ movement on the website, and gathering demographic information.</p>
              <h3>Cookies and Web Beacons</h3>
              <p>Like any other website, playlistcalcify.tk uses ‘cookies’. These cookies are used to store information including visitors’ preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users’ experience by customizing our web page content based on visitors’ browser type and/or other information.</p>
              <p><strong>Privacy Policies</strong></p>
              <p>You may consult this list to find the Privacy Policy for each of the advertising partners of playlistcalcify.tk.</p>
              <p>Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on playlistcalcify.tk, which are sent directly to users’ browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.</p>
              <p>Note that playlistcalcify.tk has no access to or control over these cookies that are used by third-party advertisers.</p>
              <p><strong>Third Part Privacy Policies</strong></p>
              <p>playlistcalcify.tk’s Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options. You may find a complete list of these Privacy Policies and their links here and <a href="" target="_blank">here </a>: Privacy Policy Links.</p>
              <p>You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers’ respective websites. What Are Cookies?</p>
              <p><strong>Children’s Information</strong></p>
              <p>Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.</p>
              <p>playlistcalcify.tk does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.</p>
              <p><strong>Online Privacy Policy Only</strong></p>
              <p>This privacy policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in playlistcalcify.tk. This policy is not applicable to any information collected offline or via channels other than this website.</p>
              <p><strong>Consent</strong></p>
              <p>By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.</p>
            </div>
          </Dialog>
        </div>
        <Divider style={{ margin: '4px 0px 4px' }} />
        <div className="aboutDescribeFeatures">
          <div>The following information about these statistics are taken from the Spotify Developer Api located
            <a href="https://developer.spotify.com/web-api/get-audio-features/">Here</a>
          </div>
          <Divider style={{ margin: '4px 0px 4px' }} />
          <div>Acousticness: A confidence measuer of wheter or not the track is acoustic. The higher the percentage, the higher the confidencer that the track is acoustic.</div>
          <div>Danceability: Describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity. Higher values are more danceable.</div>
          <div>Energy: Represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy. For example, death metal has high energy, while a Bach prelude scores low on the scale. Perceptual features contributing to this attribute include dynamic range, perceived loudness, timbre, onset rate, and general entropy.</div>
          <div>Instrumentalness: Predicts whether a track contains no vocals. "Ooh" and "aah" sounds are treated as instrumental in this context. Rap or spoken word tracks are clearly "vocal". The closer the instrumentalness value is to 1.0, the greater likelihood the track contains no vocal content. Values above 50% are intended to represent instrumental tracks, but confidence is higher as the value is higher.</div>
          <div>Average Key: The musical Key of the playlist.</div>
          <div>Liveness: Detects the presence of an audience in the recording. Higher liveness values represent an increased probability that the track was performed live. A value above 80% provides strong likelihood that the playlist is mostly live.</div>
          <div>Loudness: The overall loudness of a playlist in decibels (dB). Loudness values are averaged across the entire playlist and are useful for comparing relative loudness of playlists. Loudness is the quality of a sound that is the primary psychological correlate of physical strength (amplitude). Values typical range between -60 and 0 db.</div>
          <div>Average Modality:	Mode indicates the modality (major or minor) of a track, the type of scale from which its melodic content is derived. Major is represented by 100% and minor is 0%.</div>
          <div>Speechiness: Speechiness detects the presence of spoken words in a playlist. The more exclusively speech-like the recording (e.g. talk show, audio book, poetry), the closer to 100% the attribute value. Values above 66% describe playlists that are probably made entirely of spoken words. Values between 33% and 66% describe playlists that may contain both music and speech, either in sections or layered, including such cases as rap music. Values below 33% most likely represent music and other non-speech-like playlists.</div>
          <div>Tempo: The overall estimated tempo of a playlist in beats per minute (BPM). In musical terminology, tempo is the speed or pace of a given piece and derives directly from the average beat duration.</div>
          <div>Time Signature: An estimated overall time signature of a playlist. The time signature (meter) is a notational convention to specify how many beats are in each bar (or measure).</div>
          <div>Valence: A measure describing the musical positiveness conveyed by a track. Playlists with high valence sound more positive (e.g. happy, cheerful, euphoric), while playlists with low valence sound more negative (e.g. sad, depressed, angry).</div>
        </div>
      </div>

    );
  }
}


export default About;
