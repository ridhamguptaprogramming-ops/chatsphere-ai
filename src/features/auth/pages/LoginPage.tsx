import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FaArrowRight, FaGoogle, FaGithub, FaEye, FaEyeSlash, FaShield } from 'react-icons/fa6';
import { authService } from '@/services/auth.service';

interface LoginFormValues {
  email: string;
  password: string;
}

function WaveBackground() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 800" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6D5DF6" stopOpacity={0.12} />
          <stop offset="50%" stopColor="#8B72FF" stopOpacity={0.06} />
          <stop offset="100%" stopColor="#5646E0" stopOpacimport { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { u"0import { Link, useLocation, useNavigate } from 'rea  import { useForm } from 'react-hook-form';
import { motion } from  import { motion } from 'framer-motion';
i95import { FaArrowRight, FaGoogle, FaGitGrimport { authService } from '@/services/auth.service';

interface LoginFormValues {
  email: stff
interface LoginFormValues {
  email: string;
  passw     email: string;
  passworop  password: str s}

function WaveBa/>
    return (
    <svg classN"     <svg ="      <defs>
        <linearGradient id="wg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6D5DF6" stopOpacity={0wb        <liia          <stop offset="0%" stopColor="#6D5DF6" stopOpacity={0.12} /"6          <stop offset="50%" stopColor="#8B72FF" stopOpacity={0.06} rx          "360" fill="url(#wg1)" filter="url(#wb1)" />
      <ellipse cimport { Link, useLocation, useNavigate } from 'react-router-dom';
import { u"0import { Link, useLocation, usfiimport { u"0import { Link, useLocation, useNavigate } from 'rea  ="import { motion } from  import { motion } from 'framer-motion';
i95import { FaArrowRight, FaGoogle, FaGitG0,i95import { FaArrowRight, FaGoogle, FaGitGrimport { authServic24
interface LoginFormValues {
  email: stff
interface LoginFormValues {
  email: string;
  passw  </  email: stff
interface Loe=interface Lo f  e="url(#wg2)" filter="url(  passw     ema <  passworop  password: st d
function WaveBa/>
    retuinit    return (
   0     <svg cl0,        <linearGradient id="wg1" x1="0%00          <stop offset="0%" stopColor="#6D5DF6" stopOpacity={0wb    60      <ellipse cimport { Link, useLocation, useNavigate } from 'react-router-dom';
import { u"0import { Link, useLocation, usfiimport { u"0import { Link, useLocation, useNavigate } from 'rea  ="import { motion } from  import { motion } from 'framer-motion';
i95import { 62import { u"0import { Link, useLocation, usfiimport { u"0import { Link, useLocatio56i95import { FaArrowRight, FaGoogle, FaGitG0,i95import { FaA0 240,620 360,560 C480,500 560,620 600,540 L600,800 L0,800 Z" />
      </path>
      <circle cx="140" cy="220" r="40interface LoginFormValues {
  email: stff
interface LoginFormValues {
  email: string;
  passw  </  email: t=  email: stff
interface Lo90interface Lo    email: string;
  passw  x=  passw  </  emr=interface Loe=interfacecifunction WaveBa/>
    retuinit    return (
   0     <svg cl0,        <linearGradient id="wg1" x1="0"     retuinit    48   0     <svg cl0,       import { u"0import { Link, useLocation, usfiimport { u"0import { Link, useLocation, useNavigate } from 'rea  ="import { motion } from  import { motion } from 'framer-motion';
i95import { 62import { u"0import { ;
i95import { 62import { u"0import { Link, useLocation, usfiimport { u"0import { Link, useLocatio56i95import { FaArrowRight, FaGoogle, FaGitG0,i95import { FaA0 240,62() * 2, del      </path>
      <circle cx="140" cy="220" r="40interface LoginFormValues {
  email: stff
interface LoginFormValues {
  email: string;
  passw  </  email: t=  email: stff
interface Lo90interface Lo    email: string;
,       <circlge  email: stff
interface LoginFormValues {
  email: string;
  paininterface Lo}<  email: string;
  passw  nD  passw  </  emn interface Lo90interface Lo    emai g  passw  x=  passw  </  emr=interface Loe=iun    retuinit    return (
   0     <svg cl0,    k w-2 h-[2px] rounded-fu   0     <svg cl0,      ci95import { 62import { u"0import { ;
i95import { 62import { u"0import { Link, useLocation, usfiimport { u"0import { Link, useLocatio56i95import { FaArrowRight, FaGoogle, FaGitG0,i95import { FaA0 240,62() * 2, del      </path>
      <circle cx="140" cy="220" r="40interface LwPi95import { 62import { u"0import {  [      <circle cx="140" cy="220" r="40interface LoginFormValues {
  email: stff
interface LoginFormValues {
  email: string;
  passw  </  email: t=  email: stff
interface Lo90interface Lo ri  email: stff
interface LoginFormValues {
  email: string;
  pa uinterface Loe)  email: string;
  passw  Ma  passw  </  emStinterface Lo90interface Lo    emaise,       <circlge  email: stff
interface Logstinterface LoginFormValues {
 {  email: string;
  painint=   paininterfacerm  passw  nD  passw  </  emn interfa.s   0     <svg cl0,    k w-2 h-[2px] rounded-fu   0     <svg cl0,      ci95import { 62import { u"0import { ;
i95import { 62import { uusi95import { 62import { u"0import { Link, useLocation, usfiimport { u"0import { Link, useLocatio56i95import        <circle cx="140" cy="220" r="40interface LwPi95import { 62import { u"0import {  [      <circle cx="140" cy="220" r="40inte) { setServerError(err instanceof Error ? err.message : "Unab  email: stff
interface LoginFormValues {
  email: string;
  passw  </  email: t=  email: stff
interface Lo90interface Lo ri  email: stff
interface Lor interface Lol   email: string;
  passw  se  passw  </  emllinterface Lo90interface Lo ri  emanIinterface LoginFormValues {
  email: strili  email: string;
  pa uint")  pa uinterfacenp  passw  Ma  passw  </  emStinterfa cinterface Logstinterface LoginFormValues {
 {  email: string;
  painint=   paininterfacerm  ") {  email: string;
  painint=   painintervi  painint=   paingii95import { 62import { uusi95import { 62import { u"0import { Link, useLocation, usfiimport { u"0import { Link, useLocatio56i95import        <circle cx="140" cy="220" r="40orinterface LoginFormValues {
  email: string;
  passw  </  email: t=  email: stff
interface Lo90interface Lo ri  email: stff
interface Lor interface Lol   email: string;
  passw  se  passw  </  emllinterface Lo90interface Lo ri  emanIinterface LoginFormValues {
  email: strili  email: string;
  pa uint")  pa uinterfacenp  passw  Ma  pve  email: string;
  passw  cl  passw  </  emr-interface Lo90interface Lo ri  ema  interface Lor interface Lol   email: stri h  passw  se  passw  </  emllinterface Lo90i-f  email: strili  email: string;
  pa uint")  pa uinterfacenp  passw  Ma  passw  </  emStin[3  pa uint")  pa uinterfacenp  g- {  email: string;
  painint=   paininterfacerm  ") {  email: string;
  painint=   painintervi  painint=  ={  painint=   painle  painint=   painintervi  painint=   paingii95impt"  email: string;
  passw  </  email: t=  email: stff
interface Lo90interface Lo ri  email: stff
interface Lor interface Lol   email: string;
  passw  se  passw  </  emllinterface Lo90interface Lo ri  emanIinterface LoginFormValues {
  email: {/  passw  </  em}
interface Lo90interface Lo ri  emaidinterface Lor interface Lol   email: stril   passw  se  passw  </  emllinterface Lo90i <  email: strili  email: string;
  pa uint")  pa uinterfacenp  passw  Ma  pve  email: striny-  pa uint")  pa uinterfacenp  pt  passw  cl  passw  </  emr-interface Lo90interface Lo ri  
   pa uint")  pa uinterfacenp  passw  Ma  passw  </  emStin[3  pa uint")  pa uinterfacenp  g- {  email: string;
  painint=   paininterfacerm  ") {  email: string;
  painint=   painintCS  painint=   paininterfacerm  ") {  email: string;
  painint=   painintervi  painint=  ={  painint=   painle Sp  painint=   painintervi  painint=  ={  painint= f=  passw  </  email: t=  email: stff
interface Lo90interface Lo ri  email:0 hover:text-white/60 transition-colors">Back to webinterface Lo90interface Lo ri  e/a>
interface Lor interface Lol   email: stri="  passw  se  passw  </  emllinterface Lo90i
   email: {/  passw  </  em}
interface Lo90interface Lo ri  emaidinterface Lor interface Losiinterface Lo90interface Loay  pa uint")  pa uinterfacenp  passw  Ma  pve  email: striny-  pa uint")  pa uinterfacenp  pt  passw  cl  passw  </  emr-interface Lo90interface Lo ri  
       pa uint")  pa uinterfacenp  passw  Ma  passw  </  emStin[3  pa uint")  pa uinterfacenp  g- {  email: string;
  painint=   paininterfacerm  ") {  emli  painint=   paininterfacerm  ") {  email: string;
  painint=   painintCS  painint=   paininterfacerm  ") {  e-w  painint=   painintCS  painint=   paininterfacerid  painint=   painintervi  painint=  ={  painint=   painle Sp  painint= meinterface Lo90interface Lo ri  email:0 hover:text-white/60 transition-colors">Back to webinterface Lo90interface Lo ri  e/a>
interface Lor interfulinterface Lor interface Lol   email: stri="  passw  se  passw  </  emllinterface Lo90i
   email: {/  passw  </  em}
interfae    email: {/  passw  </  em}
interface Lo90interface Lo ri  emaidinterface Lor interflainterface Lo90interface Lo ap       pa uint")  pa uinterfacenp  passw  Ma  passw  </  emStin[3  pa uint")  pa uinterfacenp  g- {  email: string;
  painint=   paininterfacerm  ") {  emli  painint=   paininterfacerm  ") {  email: string;
  painint=   painintCS  painint=    t  painint=   paininterfacerm  ") {  emli  painint=   paininterfacerm  ") {  email: string;
  painint=   painintCS  i  painint=   painintCS  painint=   paininterfacerm  ") {  e-w  painint=         <div classNinterface Lor interfulinterface Lor interface Lol   email: stri="  passw  se  passw  </  emllinterface Lo90i
   email: {/  passw  </  em}
interfae    email: {/  passw  </  em}
interface Lo90interface Lo ri  emaidinterface Lor interflainterface Lo90interface Lo ap       pa uint")  pa uinterfacenp  passw  Ma ro   email: {/  passw  </  em}
interfae    email: {/  passw  </  em}
interface Lo90interface Lo ri  emaidinteteinterfae    email: {/  pass<hinterface Lo90interface Lo ri  emaidnt  painint=   paininterfacerm  ") {  emli  painint=   paininterfacerm  ") {  email: string;
  painint=   painintCS  painint=    t  painint=   paininterfacerm  ") {  emli  painint=   paininterfacerm  ") bm  painint=   painintCS  painint=    t  painint=   paininterfacerm  ") {                 <la  painint=   painintCS  i  painint=   painintCS  painint=   paininterfacerm  ") {  e-w  painint=         <div classNinterface id   email: {/  passw  </  em}
interfae    email: {/  passw  </  em}
interface Lo90interface Lo ri  emaidinterface Lor interflainterface Lo90interface Lo ap       pa uint")  pa uinterfacenp  passw  Ma ro   email: {/  passw  <erinterfae    email: {/  passteinterface Lo90interface Lo ri  emaidm"interfae    email: {/  passw  </  em}
interface Lo90interface Lo ri  emaidinteteinterfae    email: {/  pass<hinterface Lo90interface Lo ri  emaidnt  painint=   pilinterface Lo90interface Lo ri  emaidre  painint=   painintCS  painint=    t  painint=   paininterfacerm  ") {  emli  painint=   paininterfacerm  ") bm  painint=   painintCS  painint=    t  painint=   paininterfacerm  ") {               blinterfae    email: {/  passw  </  em}
interface Lo90interface Lo ri  emaidinterface Lor interflainterface Lo90interface Lo ap       pa uint")  pa uinterfacenp  passw  Ma ro   email: {/  passw  <erinterfae    email: {/  passteinterface Lo90interface Lo ri  emaidm"interfae    email: {/  passw  </  em}
interface Lo90interface Lo ri  emaidinteteinterfae    emaswinterface Lo90interface Lo ri  emaidpainterface Lo90interface Lo ri  emaidinteteinterfae    email: {/  pass<hinterface Lo90interface Lo ri  emaidnt  painint=   pilinterface Lo90interface Lo ri  emaidre  painint=   painintCS  painint=    t  painint=   paininterfacerm  ") {  emli  painint=   paininte.0interface Lo90interface Lo ri  emaidinterface Lor interflainterface Lo90interface Lo ap       pa uint")  pa uinterfacenp  passw  Ma ro   email: {/  passw  <erinterfae    email: {/  passteinterface Lo90interface Lo ri  emaidm"interfae    email: {/  passw  </  em}
interface Lo90interface Lo ri  emaidinteteinterfae    emaswinterface Lo90interface Lo ri  emaidpainterface Lo90interface Lo ri  emaidinteSinterface Lo90interface Lo ri  emaidinteteinterfae    emaswinterface Lo90interface Lo ri  emaidpainterface Lo90interface Lo ri  emaidinteteinterfae    email: {/  pass<hinterface Lo90interface Lo ri  emaidnt  painint=   pilinterface Lo90interface Lo ri  emaidre >
interface Lo90interface Lo ri  emaidinteteinterfae    emaswinterface Lo90interface Lo ri  emaidpainterface Lo90interface Lo ri  emaidinteSinterface Lo90interface Lo ri  emaidinteteinterfae    emaswinterface Lo90interface Lo ri  emaidpainterface Lo90interface Lo ri  emaidinteteinterfae    email: {/  pass<hinterface Lo90interface Lo ri  emaidnt  painint=   pilinterface Lo90interface Lo ri  emaidre >
interface Lo90interface Lo ri  emaidinteteinterfae    emaswinterface Lo90interface Lo ri  emaidpainterface Lo90interface Lo ri  emaidinteSinterface Lo90interface Lo ri  emaidinteteinterfae    emaswinterface Lo90interface4.interface Lo90interface Lo ri  emaidinteteinterfae    emaswinterface Lo90interface Lo ri  emaidpainterface Lo90interface Lo ri  emaidinteSinterface Lo90interface Lo ri  emaidinteteinterfae    emaswinterface Lo90interface Lo ri  emaidpainterface Lo90interface Lo ri  emaidinteteinterfae    email: {/  pass<hinterface Lo90interface Lo ri  emaidnt  painint=   pilinterface Lo90interface Lo ri  emaidre veinterface Lo90interface Lo ri  emaidinteteinterfae    emaswinterface Lo90interface Lo ri  emaidpainterface Lo90interface Lo ri  emaidinteSinterface Lo90interface Lo ri  emaidinteteinterfae    emaswinterface Lo90interface4.interface Lo90interface Lo ri  emaidinteteinterfae    emaswinterface Lo90interface Lo ri  emaidpainterface Lo90interface Lo ri  emaidinteSinterface Lo90interface Lo ri  emaidintentTarget.style.backgroundPosition = "right center"; e.currentTarget.style.boxShadow = "0 6px 28px rgba(109, 93, 246, 0.35)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundPosition = "left center"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(109, 93, 246, 0.25)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                  {isSubmitting ? (<span className="flex items-center justify-center gap-2"><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Signing in...</span>) : (<span className="flex items-center justify-center gap-2">Continue to ChatSphere<FaArrowRight size={13} /></span>)}
                </button>
              </form>
              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
                <span className="text-[11px] font-medium uppercase                   onMouseLeave={(e) => { e.currentTarget.style.backgroundPosition = "left center"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(109, 93, 246, 0.25)"; e.curre                    {isSubmitting ? (<span className="flex items-center justify-center gap-2"><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Signing in...</span>) : (<span classNamit                </button>
              </form>
              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
                <span className="text-[11px] font-medium uppercase                   onMouseLeave={(eRe              </form>
  e               <div cn>                <div className="h-pxn" className="flex w-full                <span className="text-[11px] font-medium uppercase                   onMouseLeave={(e) => { e.curd              </form>
              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
                <span className="text-[11px] font-medium uppercase                   onMouseLeave={(eRe              </form>
  e               <div cn>                <div className="h-pxn" className="flex w-full                <span className="text-[11px] font-medium uppercase                   onMou0/              <div c}
                <div className="h-px flex-1 bg-gradient-to-t-                <span className="text-[11px] font-medium uppercase                   onMouseLeave={(eRe         Na  e               <div cn>                <div className="h-pxn" className="flex w-full                <span className="texon              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
                <span classNameil to receive a o                <div className="h-px flex-1 bg-gradient-to-e=                <span className="text-[11px] font-medium uppercase                   onMouseLeave={(eRe         se  e               <div cn>                <div className="h-pxn" className="flex w-full                <span className="tex/[                <div className="h-px flex-1 bg-gradient-to-t-                <span className="text-[11px] font-medium uppercase                   onMouseLeave={(eRe         Na  e               <div c||                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
                <span classNameil to receive a o                <div className="h-px flex-1 bg-gradient-to-e=                <span className="text-[11px] font-medium uppercase                   onMouseLeave={(eRe         se  e               <div/2                <span classNameil to receive a o                <div className="h-px flex-1 bg-gradient-to-e=                     <span classNameil to receive a o                <div className="h-px flex-1 bg-gradient-to-e=                <span className="text-[11px] font-medium uppercase                   onMouseLeave={(eRe         se  e               <div/2                <span classNameil to receive a o                <div className="h-px flex-1 bg-gradient-to-e=                     <span classNameil to receive a o                <div className="h-px flex-1 bg-gradient-to-e=                <span className="text-[11px] font-medium uppercase                   onMouseLeave={(eRe         se  e               <div/2                <span classNameil to receive a o     /motion.div>
    </div>
  );
}
