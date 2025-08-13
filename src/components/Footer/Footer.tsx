import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <div className={styles.footer}>
      <img
        src="	https://6ptotvmi5753.edge.naverncp.com/KBO_IMAGE/KBOHome/resources/images/common/h2_logo.png"
        className={styles.footerLogo}
      />
      <div className={styles.footerText}>
        <p>ⓒ KBO & Naver Corp. All rights reserved.</p>
        <p>본 사이트는 KBO 리그의 공식 홈페이지가 아닙니다.</p>
        <p>본 사이트의 모든 콘텐츠는 저작권법의 보호를 받습니다.</p>
      </div>
    </div>
  );
}
